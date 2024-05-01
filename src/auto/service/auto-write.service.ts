/**
 * Dieses Modul enthält die {@linkcode Auto-WriteService} Klasse,
 * als Abstraktion von Schreiboperationen im Anwendungskern und DB-Zugriffen.
 * @packageDocumentation
 */
import { type DeleteResult, Repository } from 'typeorm';
import {
    FinAlreadyExistsException,
    VersionInvalidException,
    VersionOutdatedException,
} from './exceptions.js';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Auto } from '../entity/auto.entity.js';
import { AutoReadService } from './auto-read.service.js';
import { Eigentuemer } from '../entity/eigentuemer.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from '../../mail/mail.service.js';
import { getLogger } from '../../logger/logger.js';

/**
 * Typdefinitionen, die die Struktur eines Objekt vorgeben, das zum Updaten
 * übergeben werden soll.
 */
export interface UpdateParams {
    /** ID des zu aktualisierenden Autos. */
    readonly id: number | undefined;
    /** Auto-Objekt mit den aktualisierten Werten. */
    readonly auto: Auto;
    /** Versionsnummer für die aktualisierenden Werte. */
    readonly version: string;
}

/**
 * Die Klasse `AutoWriteService` implementiert den Anwendungskern für das
 * Schreiben von Autos und greift mit _TypeORM_ auf die DB zu.
 */
@Injectable()
export class AutoWriteService {
    private static readonly VERSION_PATTERN = /^"\d{1,3}"/u;

    readonly #repo: Repository<Auto>;

    readonly #readService: AutoReadService;

    readonly #logger = getLogger(AutoWriteService.name);

    readonly #mailService: MailService;

    constructor(
        @InjectRepository(Auto) repo: Repository<Auto>,
        readService: AutoReadService,
        mailService: MailService,
    ) {
        this.#repo = repo;
        this.#readService = readService;
        this.#mailService = mailService;
    }

    /**
     * Anlegen eines neuen Autos.
     * @param auto Auto das angelegt werden soll.
     * @returns Die dem angelegten Auto zugehörige ID.
     */
    async create(auto: Auto): Promise<number> {
        this.#logger.debug('create: auto=%o', auto);
        await this.#validateCreate(auto);

        const autoDb = await this.#repo.save(auto);
        this.#logger.debug('create: autoDb=%o', autoDb);

        await this.#writeMail(autoDb, 'neu angelegt', 'neu angelegt');
        return autoDb.id!;
    }

    /**
     * Aktualisierung eines bereits existierenden Autos.
     * @param auto Auto welches aktualisiert werden soll.
     * @param id ID des zu aktualisierenden Autos.
     * @param version Die Versionsnummer.
     * @returns Die neue Versionsnummer.
     * @throws VersionInvalidException bei ungültiger Versionsnummer.
     * @throws VersionOutdatedException bei veralteter Versionsnummer.
     */
    async update({ id, auto, version }: UpdateParams): Promise<number> {
        this.#logger.debug(
            'update: id=%d, auto=%o, version=%s',
            id,
            auto,
            version,
        );
        if (id === undefined) {
            this.#logger.debug('update: ID ist ungueltig');
            throw new NotFoundException(
                `Es existiert kein Auto mit ID: ${id}.`,
            );
        }

        const validateResult = await this.#validateUpdate(auto, id, version);
        this.#logger.debug('update: validateResult=%o', validateResult);
        if (!(validateResult instanceof Auto)) {
            return validateResult;
        }

        const autoNeu = validateResult;
        const merged = this.#repo.merge(autoNeu, auto);
        this.#logger.debug('update: merged=%o', merged);
        const updated = await this.#repo.save(merged);
        this.#logger.debug('update: updated=%o', updated);

        return updated.version!;
    }

    /**
     * Löschen eines Autos durch seine ID.
     *
     * @param id ID des zu löschenden Autos.
     * @returns true, bei erfolgreichem löschen. Sonst false.
     */
    async delete(id: number) {
        this.#logger.debug('delete: id: %d', id);
        const auto = await this.#readService.findById({
            id,
            mitAusstattung: false,
        });

        let deleteResult: DeleteResult | undefined;
        await this.#repo.manager.transaction(async (transactionalMgr) => {
            const eigentuemerID = auto.eigentuemer?.id;
            if (eigentuemerID !== undefined) {
                await transactionalMgr.delete(Eigentuemer, eigentuemerID);
            }
            deleteResult = await transactionalMgr.delete(Auto, id);
            this.#logger.debug('delete: deleteResult=%o', deleteResult);
        });
        return (
            deleteResult?.affected !== undefined &&
            deleteResult.affected !== null &&
            deleteResult.affected > 0
        );
    }

    async #validateCreate({ fin }: Auto): Promise<undefined> {
        this.#logger.debug('#validateCreate: fin=%s', fin);
        if (await this.#repo.existsBy({ fin })) {
            throw new FinAlreadyExistsException(fin);
        }
    }

    async #validateUpdate(
        auto: Auto,
        id: number,
        version: string,
    ): Promise<Auto> {
        const versionNum = this.#validateVersion(version);
        this.#logger.debug(
            `#validateUpdate: Version: ${versionNum}, auto: auto=%o `,
            auto,
        );
        const resultFindById = await this.#findByIdAndCheckVersion(
            id,
            versionNum,
        );
        this.#logger.debug('#validateUpdate: %o', resultFindById);
        return resultFindById;
    }

    #validateVersion(version: string | undefined): number {
        this.#logger.debug('#validateVersion: version=%s', version);
        if (
            version === undefined ||
            !AutoWriteService.VERSION_PATTERN.test(version)
        ) {
            throw new VersionInvalidException(version);
        }
        return Number.parseInt(version.slice(1, -1), 10);
    }

    async #findByIdAndCheckVersion(id: number, version: number): Promise<Auto> {
        const autoDB = await this.#readService.findById({ id });
        const versionDB = autoDB.version!;
        if (version < versionDB) {
            this.#logger.debug(
                '#findByIdAndCheckVersion: VersionOutdated=%d',
                version,
            );
            throw new VersionOutdatedException(version);
        }
        return autoDB;
    }

    async #writeMail(auto: Auto, s1: string, s2: string) {
        const subject = `Auto ${s1} (ID: ${auto.id})`;
        const { fin } = auto;
        const eigentuemer = auto.eigentuemer?.eigentuemer ?? 'Unbekannt';
        const body = `Ein Auto mit der fin: ${fin} 
        und dem Eigentümer ${eigentuemer} wurde ${s2}`;
        await this.#mailService.sendmail({ subject, body });
    }
}
