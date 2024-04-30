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
var AutoGetController_1;
import { ApiHeader, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiProperty, ApiResponse, ApiTags, } from '@nestjs/swagger';
import { AutoReadService, } from '../service/auto-read.service.js';
import { Controller, Get, Headers, HttpStatus, Param, Query, Req, Res, UseInterceptors, } from '@nestjs/common';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
import { getBaseUri } from './getBaseUri.js';
import { getLogger } from '../../logger/logger.js';
import { paths } from '../../config/paths.js';
import { Public } from 'nest-keycloak-connect';
export class AutoQuery {
}
__decorate([
    ApiProperty({ required: false }),
    __metadata("design:type", String)
], AutoQuery.prototype, "modellbezeichnung", void 0);
__decorate([
    ApiProperty({ required: false }),
    __metadata("design:type", String)
], AutoQuery.prototype, "hersteller", void 0);
__decorate([
    ApiProperty({ required: false }),
    __metadata("design:type", String)
], AutoQuery.prototype, "fin", void 0);
__decorate([
    ApiProperty({ required: false }),
    __metadata("design:type", Number)
], AutoQuery.prototype, "kilometerstand", void 0);
__decorate([
    ApiProperty({ required: false }),
    __metadata("design:type", Date)
], AutoQuery.prototype, "auslieferungstag", void 0);
__decorate([
    ApiProperty({ required: false }),
    __metadata("design:type", Number)
], AutoQuery.prototype, "grundpreis", void 0);
__decorate([
    ApiProperty({ required: false }),
    __metadata("design:type", Boolean)
], AutoQuery.prototype, "istAktuellesModell", void 0);
__decorate([
    ApiProperty({ required: false }),
    __metadata("design:type", String)
], AutoQuery.prototype, "getriebeArt", void 0);
__decorate([
    ApiProperty({ required: false }),
    __metadata("design:type", String)
], AutoQuery.prototype, "eigentuemer", void 0);
const APPLICATION_HAL_JSON = 'application/hal+json';
let AutoGetController = AutoGetController_1 = class AutoGetController {
    #service;
    #logger = getLogger(AutoGetController_1.name);
    constructor(service) {
        this.#service = service;
    }
    async getById(idStr, req, version, res) {
        this.#logger.debug('getById: idStr=%s, version=%s"', idStr, version);
        const id = Number(idStr);
        if (Number.isNaN(id)) {
            this.#logger.debug('getById: NaN');
            return res.sendStatus(HttpStatus.NOT_FOUND);
        }
        if (req.accepts([APPLICATION_HAL_JSON, 'json', 'html']) === false) {
            this.#logger.debug('getById: accepted=%o', req.accepted);
            return res.sendStatus(HttpStatus.NOT_ACCEPTABLE);
        }
        const auto = await this.#service.findById({ id });
        if (this.#logger.isLevelEnabled('debug')) {
            this.#logger.debug('getById(): auto=%s', auto.toString());
            this.#logger.debug('getById(): eigentuemer=%o', auto.eigentuemer);
        }
        const versionDb = auto.version;
        if (version === `"${versionDb}"`) {
            this.#logger.debug('getById: NOT_MODIFIED');
            return res.sendStatus(HttpStatus.NOT_MODIFIED);
        }
        this.#logger.debug('getById: versionDb=%s', versionDb);
        res.header('ETag', `"${versionDb}"`);
        const autoModel = this.#toModel(auto, req);
        this.#logger.debug('getById: autoModel=%o', autoModel);
        return res.contentType(APPLICATION_HAL_JSON).json(autoModel);
    }
    async get(query, req, res) {
        this.#logger.debug('get: query=%o', query);
        if (req.accepts([APPLICATION_HAL_JSON, 'json', 'html']) === false) {
            this.#logger.debug('get: accepted=%o', req.accepted);
            return res.sendStatus(HttpStatus.NOT_ACCEPTABLE);
        }
        const autos = await this.#service.find(query);
        this.#logger.debug('get: %o', autos);
        const autosModel = autos.map((auto) => this.#toModel(auto, req, false));
        this.#logger.debug('get: autoModel=%o', autosModel);
        const result = { _embedded: { autos: autosModel } };
        return res.contentType(APPLICATION_HAL_JSON).json(result).send();
    }
    #toModel(auto, req, all = true) {
        const baseUri = getBaseUri(req);
        this.#logger.debug('#toModel: baseUri=%s', baseUri);
        const { id } = auto;
        const links = all
            ? {
                self: { href: `${baseUri}/${id}` },
                list: { href: `${baseUri}` },
                add: { href: `${baseUri}` },
                update: { href: `${baseUri}/${id}` },
                remove: { href: `${baseUri}/${id}` },
            }
            : { self: { href: `${baseUri}/${id}` } };
        this.#logger.debug('#toModel: auto=%o, links=%o', auto, links);
        const eigentuemerModel = {
            eigentuemer: auto.eigentuemer?.eigentuemer ?? 'N/A',
            fuehrerscheinnummer: auto.eigentuemer?.fuehrerscheinnummer ?? 'N/A',
            geburtsdatum: auto.eigentuemer?.geburtsdatum ?? 'N/A',
        };
        const autoModel = {
            modellbezeichnung: auto.modellbezeichnung,
            hersteller: auto.hersteller,
            fin: auto.fin,
            kilometerstand: auto.kilometerstand,
            auslieferungstag: auto.auslieferungstag,
            grundpreis: auto.grundpreis,
            istAktuellesModell: auto.istAktuellesModell,
            getriebeArt: auto.getriebeArt,
            eigentuemer: eigentuemerModel,
            _links: links,
        };
        return autoModel;
    }
};
__decorate([
    Get(':id'),
    Public(),
    ApiOperation({ summary: 'Suche mit der Auto-ID' }),
    ApiParam({
        name: 'id',
        description: 'z.B. 1',
    }),
    ApiHeader({
        name: 'If-None-Match',
        description: 'Header für bedingte Get-Requests, z.B."0" ',
        required: false,
    }),
    ApiOkResponse({ description: 'Das Auto wurde gefunden' }),
    ApiNotFoundResponse({ description: 'Kein Auto zur ID gefunden' }),
    ApiResponse({
        status: HttpStatus.NOT_MODIFIED,
        description: 'Das Auto wurde bereits heruntergeladen',
    }),
    __param(0, Param('id')),
    __param(1, Req()),
    __param(2, Headers('If-None-Match')),
    __param(3, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AutoGetController.prototype, "getById", null);
__decorate([
    Get(),
    Public(),
    ApiOperation({ summary: 'Suche mit Suchkriterien' }),
    ApiOkResponse({ description: 'Eine evtl. leere Liste mit Autos' }),
    __param(0, Query()),
    __param(1, Req()),
    __param(2, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AutoQuery, Object, Object]),
    __metadata("design:returntype", Promise)
], AutoGetController.prototype, "get", null);
AutoGetController = AutoGetController_1 = __decorate([
    Controller(paths.rest),
    UseInterceptors(ResponseTimeInterceptor),
    ApiTags('Auto REST-API'),
    __metadata("design:paramtypes", [AutoReadService])
], AutoGetController);
export { AutoGetController };
//# sourceMappingURL=auto-get.controller.js.map