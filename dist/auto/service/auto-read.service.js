var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
var AutoReadService_1;
import { Auto, } from '../entity/auto.entity.js';
import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryBuilder } from './query-builder.js';
import { getLogger } from '../../logger/logger.js';
let AutoReadService = class AutoReadService {
    static { AutoReadService_1 = this; }
    static ID_PATTERN = /^[1-9]\d{0,10}$/u;
    #autoProps;
    #queryBuilder;
    #logger = getLogger(AutoReadService_1.name);
    constructor(queryBuilder) {
        const autoDummy = new Auto();
        this.#autoProps = Object.getOwnPropertyNames(autoDummy);
        this.#queryBuilder = queryBuilder;
    }
    async findById({ id, mitAusstattung = false }) {
        this.#logger.debug('findById: id=%d', id);
        const auto = await this.#queryBuilder
            .buildId({ id, mitAusstattung })
            .getOne();
        if (auto === null) {
            throw new NotFoundException(`Es gibt kein Auto mit der ID: ${id}.`);
        }
        if (this.#logger.isLevelEnabled('debug')) {
            this.#logger.debug('findById: auto=%s, eigentuemer=%o', auto.toString(), auto.eigentuemer);
            if (mitAusstattung) {
                this.#logger.debug('findById: ausstattung=%o', auto.ausstattungen);
            }
        }
        return auto;
    }
    async find(suchkriterien) {
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
        const autos = await this.#queryBuilder
            .build(suchkriterien)
            .getMany();
        if (autos.length === 0) {
            this.#logger.debug('find: Keine Autos gefunden');
            throw new NotFoundException(`Keine Autos gefunden:  ${JSON.stringify(suchkriterien)}`);
        }
        this.#logger.debug('find: autos=%o', autos);
        return autos;
    }
    #checkKeys(keys) {
        let validKeys = true;
        keys.forEach((key) => {
            if (!this.#autoProps.includes(key)) {
                this.#logger.debug('#find: ungueltiges Suchkriterium "%s"', key);
                validKeys = false;
            }
        });
        return validKeys;
    }
};
AutoReadService = AutoReadService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [QueryBuilder])
], AutoReadService);
export { AutoReadService };
//# sourceMappingURL=auto-read.service.js.map