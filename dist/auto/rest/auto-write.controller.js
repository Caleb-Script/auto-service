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
var AutoWriteController_1;
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiHeader, ApiNoContentResponse, ApiOperation, ApiPreconditionFailedResponse, ApiResponse, ApiTags, } from '@nestjs/swagger';
import { AuthGuard, Roles } from 'nest-keycloak-connect';
import { Body, Controller, Delete, Headers, HttpCode, HttpStatus, Param, Post, Put, Req, Res, UseGuards, UseInterceptors, } from '@nestjs/common';
import { AutoDTO, AutoDtoOhneRef } from './autoDTO.entity.js';
import { AutoWriteService } from '../service/auto-write.service.js';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
import { getBaseUri } from './getBaseUri.js';
import { getLogger } from '../../logger/logger.js';
import { paths } from '../../config/paths.js';
const MSG_FORBIDDEN = 'Kein Token mit ausreichender Berechtigung vorhanden';
let AutoWriteController = AutoWriteController_1 = class AutoWriteController {
    #service;
    #logger = getLogger(AutoWriteController_1.name);
    constructor(service) {
        this.#service = service;
    }
    async post(autoDTO, req, res) {
        this.#logger.debug('post: autoDTO=%o', autoDTO);
        const auto = this.#autoDtoToAuto(autoDTO);
        const result = await this.#service.create(auto);
        const location = `${getBaseUri(req)}/${result}`;
        this.#logger.debug('post: location=%s', location);
        return res.location(location).send();
    }
    async put(autoDTO, id, version, res) {
        this.#logger.debug('put: id=%s, autoDTO=%o, version=%s', id, autoDTO, version);
        if (version === undefined) {
            const msg = 'Header "If-Match" fehlt';
            this.#logger.debug('put: msg=%s', msg);
            return res
                .status(HttpStatus.PRECONDITION_REQUIRED)
                .set('Content-Type', 'application/json')
                .send(msg);
        }
        const auto = this.#autoDtoOhneRefToAuto(autoDTO);
        const neueVersion = await this.#service.update({ id, auto, version });
        this.#logger.debug('put: version=%d', neueVersion);
        return res.header('ETag', `"${neueVersion}"`).send();
    }
    async delete(id) {
        this.#logger.debug('delete: id=%s', id);
        await this.#service.delete(id);
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
            modellbezeichnung: autoDTO.modellbezeichnung,
            hersteller: autoDTO.hersteller,
            fin: autoDTO.fin,
            kilometerstand: autoDTO.kilometerstand,
            auslieferungstag: autoDTO.auslieferungstag,
            grundpreis: autoDTO.grundpreis,
            istAktuellesModell: autoDTO.istAktuellesModell,
            getriebeArt: autoDTO.getriebeArt,
            eigentuemer,
            ausstattungen,
            erzeugt: undefined,
            aktualisiert: undefined,
        };
        auto.eigentuemer.auto = auto;
        auto.ausstattungen?.forEach((ausstattung) => {
            ausstattung.auto = auto;
        });
        return auto;
    }
    #autoDtoOhneRefToAuto(autoDTO) {
        return {
            id: undefined,
            version: undefined,
            modellbezeichnung: autoDTO.modellbezeichnung,
            hersteller: autoDTO.hersteller,
            fin: autoDTO.fin,
            kilometerstand: autoDTO.kilometerstand,
            auslieferungstag: autoDTO.auslieferungstag,
            grundpreis: autoDTO.grundpreis,
            istAktuellesModell: autoDTO.istAktuellesModell,
            getriebeArt: autoDTO.getriebeArt,
            eigentuemer: undefined,
            ausstattungen: undefined,
            erzeugt: undefined,
            aktualisiert: undefined,
        };
    }
};
__decorate([
    Post(),
    Roles({ roles: ['admin', 'user'] }),
    ApiOperation({ summary: 'Ein neues Auto anlegen' }),
    ApiCreatedResponse({ description: 'Erfolgreich neu angelegt' }),
    ApiBadRequestResponse({ description: 'Fehlerhafte Autodaten' }),
    ApiForbiddenResponse({ description: MSG_FORBIDDEN }),
    __param(0, Body()),
    __param(1, Req()),
    __param(2, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AutoDTO, Object, Object]),
    __metadata("design:returntype", Promise)
], AutoWriteController.prototype, "post", null);
__decorate([
    Put(':id'),
    Roles({ roles: ['admin', 'user'] }),
    HttpCode(HttpStatus.NO_CONTENT),
    ApiOperation({
        summary: 'Ein vorhandenes Auto aktualisieren',
        tags: ['Aktualisieren'],
    }),
    ApiHeader({
        name: 'If-Match',
        description: 'Header für optimistische Synchronisation',
        required: false,
    }),
    ApiNoContentResponse({ description: 'Erfolgreich aktualisiert' }),
    ApiBadRequestResponse({ description: 'Fehlerhafte Autodaten' }),
    ApiPreconditionFailedResponse({
        description: 'Falsche Version im Header "If-Match"',
    }),
    ApiResponse({
        status: HttpStatus.PRECONDITION_REQUIRED,
        description: 'Header "If-Match" fehlt',
    }),
    ApiForbiddenResponse({ description: MSG_FORBIDDEN }),
    __param(0, Body()),
    __param(1, Param('id')),
    __param(2, Headers('If-Match')),
    __param(3, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AutoDtoOhneRef, Number, Object, Object]),
    __metadata("design:returntype", Promise)
], AutoWriteController.prototype, "put", null);
__decorate([
    Delete(':id'),
    Roles({ roles: ['admin'] }),
    HttpCode(HttpStatus.NO_CONTENT),
    ApiOperation({ summary: 'Auto mit der ID löschen' }),
    ApiNoContentResponse({
        description: 'Das Auto wurde gelöscht oder war nicht vorhanden',
    }),
    ApiForbiddenResponse({ description: MSG_FORBIDDEN }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AutoWriteController.prototype, "delete", null);
AutoWriteController = AutoWriteController_1 = __decorate([
    Controller(paths.rest),
    UseGuards(AuthGuard),
    UseInterceptors(ResponseTimeInterceptor),
    ApiTags('Auto REST-API'),
    ApiBearerAuth(),
    __metadata("design:paramtypes", [AutoWriteService])
], AutoWriteController);
export { AutoWriteController };
//# sourceMappingURL=auto-write.controller.js.map