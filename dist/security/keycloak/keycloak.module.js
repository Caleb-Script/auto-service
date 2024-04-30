var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { AuthGuard, KeycloakConnectModule, RoleGuard, } from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';
import { KeycloakService } from './keycloak.service.js';
import { LoginController } from './login.controller.js';
import { LoginResolver } from './login.resolver.js';
import { Module } from '@nestjs/common';
let ConfigModule = class ConfigModule {
};
ConfigModule = __decorate([
    Module({
        providers: [KeycloakService],
        exports: [KeycloakService],
    })
], ConfigModule);
let KeycloakModule = class KeycloakModule {
};
KeycloakModule = __decorate([
    Module({
        imports: [
            KeycloakConnectModule.registerAsync({
                useExisting: KeycloakService,
                imports: [ConfigModule],
            }),
        ],
        controllers: [LoginController],
        providers: [
            KeycloakService,
            LoginResolver,
            {
                provide: APP_GUARD,
                useClass: AuthGuard,
            },
            {
                provide: APP_GUARD,
                useClass: RoleGuard,
            },
        ],
        exports: [KeycloakConnectModule],
    })
], KeycloakModule);
export { KeycloakModule };
//# sourceMappingURL=keycloak.module.js.map