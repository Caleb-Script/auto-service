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
var LoginResolver_1;
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { BadUserInputError } from '../../auto/graphql/errors.js';
import { KeycloakService } from './keycloak.service.js';
import { Public } from 'nest-keycloak-connect';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
import { UseInterceptors } from '@nestjs/common';
import { getLogger } from '../../logger/logger.js';
let LoginResolver = LoginResolver_1 = class LoginResolver {
    #keycloakService;
    #logger = getLogger(LoginResolver_1.name);
    constructor(keycloakService) {
        this.#keycloakService = keycloakService;
    }
    async login({ username, password }) {
        this.#logger.debug('login: username=%s', username);
        const result = await this.#keycloakService.login({
            username,
            password,
        });
        if (result === undefined) {
            throw new BadUserInputError('Falscher Benutzername oder falsches Passwort');
        }
        this.#logger.debug('login: result=%o', result);
        return result;
    }
    async refresh(input) {
        this.#logger.debug('refresh: input=%o', input);
        const { refresh_token } = input;
        const result = await this.#keycloakService.refresh(refresh_token);
        if (result === undefined) {
            throw new BadUserInputError('Falscher Token');
        }
        this.#logger.debug('refresh: result=%o', result);
        return result;
    }
};
__decorate([
    Mutation(),
    Public(),
    __param(0, Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LoginResolver.prototype, "login", null);
__decorate([
    Mutation(),
    Public(),
    __param(0, Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LoginResolver.prototype, "refresh", null);
LoginResolver = LoginResolver_1 = __decorate([
    Resolver('login'),
    UseInterceptors(ResponseTimeInterceptor),
    __metadata("design:paramtypes", [KeycloakService])
], LoginResolver);
export { LoginResolver };
//# sourceMappingURL=login.resolver.js.map