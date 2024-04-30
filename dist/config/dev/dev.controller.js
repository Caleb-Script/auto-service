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
import { ApiBearerAuth, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags, } from '@nestjs/swagger';
import { AuthGuard, Roles } from 'nest-keycloak-connect';
import { Controller, HttpStatus, Post, Res, UseGuards, UseInterceptors, } from '@nestjs/common';
import { DbPopulateService } from './db-populate.service.js';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
let DevController = class DevController {
    #service;
    constructor(service) {
        this.#service = service;
    }
    async dbPopulate(res) {
        await this.#service.populateTestdaten();
        const success = {
            db_populate: 'success',
        };
        return res.status(HttpStatus.OK).json(success);
    }
};
__decorate([
    Post('db_populate'),
    ApiOperation({ summary: 'DB neu laden' }),
    ApiBearerAuth(),
    ApiOkResponse({ description: 'Die DB wurde neu geladen' }),
    ApiForbiddenResponse({
        description: 'Kein Token mit ausreichender Berechtigung vorhanden',
    }),
    __param(0, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DevController.prototype, "dbPopulate", null);
DevController = __decorate([
    Controller('dev'),
    UseGuards(AuthGuard),
    Roles({ roles: ['admin'] }),
    UseInterceptors(ResponseTimeInterceptor),
    ApiTags('Dev'),
    __metadata("design:paramtypes", [DbPopulateService])
], DevController);
export { DevController };
//# sourceMappingURL=dev.controller.js.map