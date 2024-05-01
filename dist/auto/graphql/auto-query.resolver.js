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
var AutoQueryResolver_1;
import { Args, Query, Resolver } from '@nestjs/graphql';
import { AutoReadService, } from '../service/auto-read.service.js';
import { UseFilters, UseInterceptors } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter.js';
import { Public } from 'nest-keycloak-connect';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
import { getLogger } from '../../logger/logger.js';
let AutoQueryResolver = AutoQueryResolver_1 = class AutoQueryResolver {
    #service;
    #logger = getLogger(AutoQueryResolver_1.name);
    constructor(service) {
        this.#service = service;
    }
    async getAuto({ id }) {
        this.#logger.debug(`getAuto: id=${id}`);
        const auto = await this.#service.findById({ id });
        if (this.#logger.isLevelEnabled('debug')) {
            this.#logger.debug('findById: auto=%s, eigentuemer=%o', auto.toString(), auto.eigentuemer);
        }
        return auto;
    }
    async getAutos(input) {
        this.#logger.debug(`getAutos: input=${JSON.stringify(input)}`);
        const autos = await this.#service.find(input.suchkriterien);
        this.#logger.debug(`getAutos: autos=${JSON.stringify(autos)}`);
        return autos;
    }
};
__decorate([
    Query('auto'),
    Public(),
    __param(0, Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AutoQueryResolver.prototype, "getAuto", null);
__decorate([
    Query('autos'),
    Public(),
    __param(0, Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AutoQueryResolver.prototype, "getAutos", null);
AutoQueryResolver = AutoQueryResolver_1 = __decorate([
    Resolver(),
    UseFilters(HttpExceptionFilter),
    UseInterceptors(ResponseTimeInterceptor),
    __metadata("design:paramtypes", [AutoReadService])
], AutoQueryResolver);
export { AutoQueryResolver };
//# sourceMappingURL=auto-query.resolver.js.map