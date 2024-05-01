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
var AutoMutationResolver_1;
import { UseGuards, UseFilters, UseInterceptors } from '@nestjs/common';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthGuard, Roles } from 'nest-keycloak-connect';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
import { AutoDTO } from '../rest/autoDTO.entity.js';
import { AutoWriteService } from '../service/auto-write.service.js';
import { HttpExceptionFilter } from './http-exception.filter.js';
import { getLogger } from '../../logger/logger.js';
let AutoMutationResolver = AutoMutationResolver_1 = class AutoMutationResolver {
    #service;
    #logger = getLogger(AutoMutationResolver_1.name);
    constructor(service) {
        this.#service = service;
    }
    async create(autoDTO) {
        this.#logger.debug('findById: input=%o', autoDTO);
        const auto = this.#autoDtoToAuto(autoDTO);
        const id = await this.#service.create(auto);
        const payload = { id };
        return payload;
    }
    #autoDtoToAuto(autoDTO) {
        const eigentuemerDTO = autoDTO.eigentuemer;
        const eigentuemer = {
            id: undefined,
            eigentuemer: eigentuemerDTO.eigentuemer,
            geburtsdatum: eigentuemerDTO.geburtsdatum,
            fuehrerscheinnummer: eigentuemerDTO.fuehrerscheinnummer,
            auto: undefined,
        };
        const ausstattungen = autoDTO.ausstattungen?.map((ausstattungDTO) => {
            const ausstattung = {
                id: undefined,
                bezeichnung: ausstattungDTO.bezeichnung,
                preis: ausstattungDTO.preis,
                verfuegbar: ausstattungDTO.verfuegbar,
                auto: undefined,
            };
            return ausstattung;
        });
        const auto = {
            id: undefined,
            version: undefined,
            fin: autoDTO.fin,
            modellbezeichnung: autoDTO.modellbezeichnung,
            hersteller: autoDTO.hersteller,
            kilometerstand: autoDTO.kilometerstand,
            auslieferungstag: autoDTO.auslieferungstag,
            grundpreis: autoDTO.grundpreis,
            istAktuellesModell: autoDTO.istAktuellesModell,
            getriebeArt: autoDTO.getriebeArt,
            eigentuemer,
            ausstattungen,
            erzeugt: new Date(),
            aktualisiert: new Date(),
        };
        auto.eigentuemer.auto = auto;
        return auto;
    }
    async update(id, version, autoUpdateDTO) {
        this.#logger.debug(`update: id=${id} aktuelleVersion=${version}`);
        const auto = this.#autoUpdateDtoToAuto(autoUpdateDTO);
        const versionStr = `"${version}"`;
        const versionResult = await this.#service.update({
            id,
            auto,
            version: versionStr,
        });
        const payload = { version: versionResult };
        return payload;
    }
    #autoUpdateDtoToAuto(autoDTO) {
        return {
            id: undefined,
            version: undefined,
            fin: autoDTO.fin,
            modellbezeichnung: autoDTO.modellbezeichnung,
            hersteller: autoDTO.hersteller,
            kilometerstand: autoDTO.kilometerstand,
            auslieferungstag: autoDTO.auslieferungstag,
            grundpreis: autoDTO.grundpreis,
            istAktuellesModell: autoDTO.istAktuellesModell,
            getriebeArt: autoDTO.getriebeArt,
            eigentuemer: undefined,
            ausstattungen: undefined,
            erzeugt: undefined,
            aktualisiert: new Date(),
        };
    }
    async delete(id) {
        this.#logger.debug(`delete: id=${id}`);
        const deletePerformed = await this.#service.delete(id);
        return deletePerformed;
    }
};
__decorate([
    Mutation(),
    Roles({ roles: ['admin', 'user'] }),
    __param(0, Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AutoDTO]),
    __metadata("design:returntype", Promise)
], AutoMutationResolver.prototype, "create", null);
__decorate([
    Mutation(),
    Roles({ roles: ['admin', 'user'] }),
    __param(0, Args('id')),
    __param(1, Args('version')),
    __param(2, Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, AutoDTO]),
    __metadata("design:returntype", Promise)
], AutoMutationResolver.prototype, "update", null);
__decorate([
    Mutation(),
    Roles({ roles: ['admin'] }),
    __param(0, Args('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AutoMutationResolver.prototype, "delete", null);
AutoMutationResolver = AutoMutationResolver_1 = __decorate([
    Resolver(),
    UseGuards(AuthGuard),
    UseFilters(HttpExceptionFilter),
    UseInterceptors(ResponseTimeInterceptor),
    __metadata("design:paramtypes", [AutoWriteService])
], AutoMutationResolver);
export { AutoMutationResolver };
//# sourceMappingURL=auto-Mutation.resolver.js.map