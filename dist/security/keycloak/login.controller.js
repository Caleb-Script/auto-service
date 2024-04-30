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
var LoginController_1;
import { ApiConsumes, ApiOkResponse, ApiOperation, ApiProperty, ApiTags, ApiUnauthorizedResponse, } from '@nestjs/swagger';
import { Body, Controller, HttpCode, HttpStatus, Post, Res, UseInterceptors, } from '@nestjs/common';
import { KeycloakService } from './keycloak.service.js';
import { Public } from 'nest-keycloak-connect';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
import { getLogger } from '../../logger/logger.js';
import { paths } from '../../config/paths.js';
export class Login {
    username;
    password;
}
__decorate([
    ApiProperty({ example: 'admin', type: String }),
    __metadata("design:type", Object)
], Login.prototype, "username", void 0);
__decorate([
    ApiProperty({ example: 'p', type: String }),
    __metadata("design:type", Object)
], Login.prototype, "password", void 0);
export class Refresh {
    refresh_token;
}
__decorate([
    ApiProperty({ example: 'alg.payload.signature', type: String }),
    __metadata("design:type", Object)
], Refresh.prototype, "refresh_token", void 0);
let LoginController = LoginController_1 = class LoginController {
    #keycloakService;
    #logger = getLogger(LoginController_1.name);
    constructor(keycloakService) {
        this.#keycloakService = keycloakService;
    }
    async login({ username, password }, res) {
        this.#logger.debug('login: username=%s', username);
        const result = await this.#keycloakService.login({
            username,
            password,
        });
        if (result === undefined) {
            return res.sendStatus(HttpStatus.UNAUTHORIZED);
        }
        return res.json(result).send();
    }
    async refresh(body, res) {
        const { refresh_token } = body;
        this.#logger.debug('refresh: refresh_token=%s', refresh_token);
        const result = await this.#keycloakService.refresh(refresh_token);
        if (result === undefined) {
            return res.sendStatus(HttpStatus.UNAUTHORIZED);
        }
        return res.json(result).send();
    }
};
__decorate([
    Post(paths.login),
    Public(),
    HttpCode(HttpStatus.OK),
    ApiConsumes('application/x-www-form-urlencoded', 'application/json'),
    ApiOperation({ summary: 'Login mit Benutzername und Passwort' }),
    ApiOkResponse({ description: 'Erfolgreich eingeloggt.' }),
    ApiUnauthorizedResponse({
        description: 'Benutzername oder Passwort sind falsch.',
    }),
    __param(0, Body()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Login, Object]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "login", null);
__decorate([
    Post(paths.refresh),
    Public(),
    HttpCode(HttpStatus.OK),
    ApiConsumes('application/x-www-form-urlencoded', 'application/json'),
    ApiOperation({ summary: 'Refresh für vorhandenen Token' }),
    ApiOkResponse({ description: 'Erfolgreich aktualisiert.' }),
    ApiUnauthorizedResponse({
        description: 'Ungültiger Token.',
    }),
    __param(0, Body()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Refresh, Object]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "refresh", null);
LoginController = LoginController_1 = __decorate([
    Controller(paths.auth),
    UseInterceptors(ResponseTimeInterceptor),
    ApiTags('Authentifizierung und Autorisierung'),
    __metadata("design:paramtypes", [KeycloakService])
], LoginController);
export { LoginController };
//# sourceMappingURL=login.controller.js.map