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
var QueryBuilder_1;
import { Ausstattung } from '../entity/ausstattung.entity.js';
import { Auto } from '../entity/auto.entity.js';
import { Eigentuemer } from '../entity/eigentuemer.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getLogger } from '../../logger/logger.js';
let QueryBuilder = QueryBuilder_1 = class QueryBuilder {
    #autoAlias = `${Auto.name
        .charAt(0)
        .toLowerCase()}${Auto.name.slice(1)}`;
    #eigentuemerAlias = `${Eigentuemer.name
        .charAt(0)
        .toLowerCase()}${Eigentuemer.name.slice(1)}`;
    #ausstattungAlias = `${Ausstattung.name
        .charAt(0)
        .toLowerCase()}${Ausstattung.name.slice(1)}`;
    #repo;
    #logger = getLogger(QueryBuilder_1.name);
    constructor(repo) {
        this.#repo = repo;
    }
    buildId({ id, mitAusstattung = false }) {
        const queryBuilder = this.#repo.createQueryBuilder(this.#autoAlias);
        queryBuilder.innerJoinAndSelect(`${this.#autoAlias}.eigentuemer`, this.#eigentuemerAlias);
        if (mitAusstattung) {
            queryBuilder.leftJoinAndSelect(`${this.#autoAlias}.ausstattung`, this.#ausstattungAlias);
        }
        queryBuilder.where(`${this.#autoAlias}.id = :id`, { id });
        return queryBuilder;
    }
    build({ eigentuemer, ausstattung, ...props }) {
        this.#logger.debug('build: eigentuemer=%s, props=%o', eigentuemer, props);
        let queryBuilder = this.#repo.createQueryBuilder(this.#autoAlias);
        queryBuilder.innerJoinAndSelect(`${this.#autoAlias}.eigentuemer`, 'eigentuemer');
        let useWhere = true;
        if (eigentuemer !== undefined && typeof eigentuemer === 'string') {
            const ilike = 'ilike';
            queryBuilder = queryBuilder.where(`${this.#eigentuemerAlias}.eigentuemer ${ilike} :eigentuemer`, { eigentuemer: `%${eigentuemer}%` });
            useWhere = false;
        }
        Object.keys(props).forEach((key) => {
            const param = {};
            param[key] = props[key];
            queryBuilder = useWhere
                ? queryBuilder.where(`${this.#autoAlias}.${key} = :${key}`, param)
                : queryBuilder.andWhere(`${this.#autoAlias}.${key} = :${key}`, param);
            useWhere = false;
        });
        this.#logger.debug('build: sql=%s', queryBuilder.getSql());
        return queryBuilder;
    }
};
QueryBuilder = QueryBuilder_1 = __decorate([
    Injectable(),
    __param(0, InjectRepository(Auto)),
    __metadata("design:paramtypes", [Repository])
], QueryBuilder);
export { QueryBuilder };
//# sourceMappingURL=query-builder.js.map