/**
 * Dieses Modul enthält die {@linkcode Auto-ReadService} Klasse,
 * als Abstraktion von Leseoperationen im Anwendungskern und DB-Zugriffen.
 * @packageDocumentation
 */
import {
    Auto,
    type GetriebeType,
    type HerstellerType,
} from '../entity/auto.entity.js';
import { Injectable, NotFoundException } from '@nestjs/common';
import { type Ausstattung } from '../entity/ausstattung.entity.js';
import { QueryBuilder } from './query-builder.js';
import { getLogger } from '../../logger/logger.js';

/**
 * Typdefinition für `findById`
 */
export interface FindByIdParams {
    /** ID des gesuchten Autos */
    readonly id: number;
    readonly mitAusstattung?: boolean;
}

/**
 * Suchkriterien, zur Suche über Parameter.
 */
export interface Suchkriterien {
    readonly modellbezeichnung?: string;
    readonly hersteller?: HerstellerType;
    readonly fin?: string;
    readonly kilometerstand?: number;
    readonly auslieferungstag?: Date;
    readonly grundpreis?: number;
    readonly istAktuellesModell?: boolean;
    readonly getriebeArt?: GetriebeType;
    readonly eigentuemer?: string;
    readonly ausstattung?: Ausstattung;
}

/**
 * Die Klasse `AutoReadService` implementiert das Lesen für Bücher und greift
 * mit _TypeORM_ auf eine relationale DB zu.
 */
@Injectable()
export class AutoReadService {
    static readonly ID_PATTERN = /^[1-9]\d{0,10}$/u;

    readonly #autoProps: string[];

    readonly #queryBuilder: QueryBuilder;

    readonly #logger = getLogger(AutoReadService.name);

    constructor(queryBuilder: QueryBuilder) {
        const autoDummy = new Auto();
        this.#autoProps = Object.getOwnPropertyNames(autoDummy);
        this.#queryBuilder = queryBuilder;
    }

    /**
     * Ein Auto asynchron anhand seiner ID suchen
     * @param id ID des gesuchten Autos
     * @returns Das gefundene Auto
     * @throws NotFoundException falls kein Auto mit der gesuchten ID gefunden wird
     */
    async findById({id, mitAusstattung = false }: FindByIdParams){
        this.#logger.debug('findById: id=%d', id);

        const auto: Auto | null = await this.#queryBuilder
            .buildId({ id, mitAusstattung })
            .getOne();
        if (auto === null) {
            throw new NotFoundException(`Es gibt kein Auto mit der ID: ${id}.`);
        }

        if (this.#logger.isLevelEnabled('debug')) {
            this.#logger.debug(
                'findById: auto=%s, eigentuemer=%o',
                auto.toString(),
                auto.eigentuemer,
            );
            if (mitAusstattung) {
                this.#logger.debug(
                    'findById: ausstattung=%o',
                    auto.ausstattungen,
                );
            }
        }
        return auto;
    }

    /**
     * Autos werden asynchron gesucht
     * @param suchkriterien JSON-Objekt mit den gegebenen Suchrkriterien
     * @returns Ein JSON-Array mit den gefundenen Autos
     * @returns NotFoundException falls keine Autos gefunden werden
     */
    async find(suchkriterien?: Suchkriterien): Promise<Auto[]> {
        this.#logger.debug('find: suchkriterien=%o', suchkriterien);

        if (suchkriterien === undefined) {
            return this.#queryBuilder.build({}).getMany();
        }
        const keys = Object.keys(suchkriterien);
        if (keys.length === 0) {
            return this.#queryBuilder.build(suchkriterien).getMany();
        }

        if (!this.#checkKeys(keys)) {
            throw new NotFoundException('Ungueltige Suchkriterien');
        }

        const autos: Auto[] = await this.#queryBuilder.build(suchkriterien).getMany();
        if (autos.length === 0) {
            this.#logger.debug('find: Keine Autos gefunden');
            throw new NotFoundException(
                `Keine Autos gefunden:  ${JSON.stringify(suchkriterien)}`,
            );
        }
        this.#logger.debug('find: autos=%o', autos);
        return autos;
    }

    #checkKeys(keys: string[]) {
        let validKeys = true;
        keys.forEach((key) => {
            if (!this.#autoProps.includes(key)) {
                this.#logger.debug(
                    '#find: ungueltiges Suchkriterium "%s"',
                    key,
                );
                validKeys = false;
            }
        });
        return validKeys;
    }
}
