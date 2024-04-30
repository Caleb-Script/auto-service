var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { AutoGetController } from './rest/auto-get.controller.js';
import { AutoQueryResolver } from './graphql/auto-query.resolver.js';
import { AutoReadService } from './service/auto-read.service.js';
import { AutoWriteController } from './rest/auto-write.controller.js';
import { AutoWriteService } from './service/auto-write.service.js';
import { KeycloakModule } from '../security/keycloak/keycloak.module.js';
import { MailModule } from '../mail/mail.module.js';
import { Module } from '@nestjs/common';
import { QueryBuilder } from './service/query-builder.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './entity/entities.js';
import { AutoMutationResolver } from './graphql/auto-Mutation.resolver.js';
let AutoModule = class AutoModule {
};
AutoModule = __decorate([
    Module({
        imports: [KeycloakModule, MailModule, TypeOrmModule.forFeature(entities)],
        controllers: [AutoGetController, AutoWriteController],
        providers: [
            AutoReadService,
            AutoWriteService,
            AutoQueryResolver,
            AutoMutationResolver,
            QueryBuilder,
        ],
        exports: [AutoReadService, AutoWriteService],
    })
], AutoModule);
export { AutoModule };
//# sourceMappingURL=auto.module.js.map