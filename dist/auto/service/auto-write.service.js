var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
var AutoWriteService_1;
import { Repository } from 'typeorm';
import { FinAlreadyExistsException, VersionInvalidException, VersionOutdatedException, } from './exceptions.js';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Auto } from '../entity/auto.entity.js';
import { AutoReadService } from './auto-read.service.js';
import { Eigentuemer } from '../entity/eigentuemer.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from '../../mail/mail.service.js';
import { getLogger } from '../../logger/logger.js';
let AutoWriteService = class AutoWriteService {
    static { AutoWriteService_1 = this; }
    static VERSION_PATTERN = /^"\d{1,3}"/u;
    #repo;
    #readService;
    #logger = getLogger(AutoWriteService_1.name);
    #mailService;
    constructor(repo, readService, mailService) {
        this.#repo = repo;
        this.#readService = readService;
        this.#mailService = mailService;
    }
    async create(auto) {
        this.#logger.debug('create: auto=%o', auto);
        await this.#validateCreate(auto);
        const autoDb = await this.#repo.save(auto);
        this.#logger.debug('create: autoDb=%o', autoDb);
        await this.#writeMail(autoDb, 'neu angelegt', 'neu angelegt');
        return autoDb.id;
    }
    async update({ id, auto, version }) {
        this.#logger.debug('update: id=%d, auto=%o, version=%s', id, auto, version);
        if (id === undefined) {
            this.#logger.debug('update: ID ist ungueltig');
            throw new NotFoundException(`Es existiert kein Auto mit ID: ${id}.`);
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
        return updated.version;
    }
    async delete(id) {
        this.#logger.debug('delete: id: %d', id);
        const auto = await this.#readService.findById({
            id,
            mitAusstattung: false,
        });
        let deleteResult;
        await this.#repo.manager.transaction(async (transactionalMgr) => {
            const eigentuemerID = auto.eigentuemer?.id;
            if (eigentuemerID !== undefined) {
                await transactionalMgr.delete(Eigentuemer, eigentuemerID);
            }
            deleteResult = await transactionalMgr.delete(Auto, id);
            this.#logger.debug('delete: deleteResult=%o', deleteResult);
        });
        return (deleteResult?.affected !== undefined &&
            deleteResult.affected !== null &&
            deleteResult.affected > 0);
    }
    async #validateCreate({ fin }) {
        this.#logger.debug('#validateCreate: fin=%s', fin);
        if (await this.#repo.existsBy({ fin })) {
            throw new FinAlreadyExistsException(fin);
        }
    }
    async #validateUpdate(auto, id, version) {
        const versionNum = this.#validateVersion(version);
        this.#logger.debug(`#validateUpdate: Version: ${versionNum}, auto: auto=%o `, auto);
        const resultFindById = await this.#findByIdAndCheckVersion(id, versionNum);
        this.#logger.debug('#validateUpdate: %o', resultFindById);
        return resultFindById;
    }
    #validateVersion(version) {
        this.#logger.debug('#validateVersion: version=%s', version);
        if (version === undefined ||
            !AutoWriteService_1.VERSION_PATTERN.test(version)) {
            throw new VersionInvalidException(version);
        }
        return Number.parseInt(version.slice(1, -1), 10);
    }
    async #findByIdAndCheckVersion(id, version) {
        const autoDB = await this.#readService.findById({ id });
        const versionDB = autoDB.version;
        if (version < versionDB) {
            this.#logger.debug('#findByIdAndCheckVersion: VersionOutdated=%d', version);
            throw new VersionOutdatedException(version);
        }
        return autoDB;
    }
    async #writeMail(auto, s1, s2) {
        const subject = `Auto ${s1} (ID: ${auto.id})`;
        const { fin } = auto;
        const eigentuemer = auto.eigentuemer?.eigentuemer ?? 'Unbekannt';
        const body = `Ein Auto mit der fin: ${fin} 
        und dem Eigentümer ${eigentuemer} wurde ${s2}`;
        await this.#mailService.sendmail({ subject, body });
    }
};
AutoWriteService = AutoWriteService_1 = __decorate([
    Injectable(),
    __param(0, InjectRepository(Auto)),
    __metadata("design:paramtypes", [Repository,
        AutoReadService,
        MailService])
], AutoWriteService);
export { AutoWriteService };
//# sourceMappingURL=auto-write.service.js.map