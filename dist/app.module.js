var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { graphQlModuleOptions } from './config/resources/graphql/graphql.js';
import { typeOrmModuleOptions } from './config/typeormOptions.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { entities } from './auto/entity/entities.js';
import { AutoGetController } from './auto/rest/auto-get.controller.js';
import { AutoWriteController } from './auto/rest/auto-write.controller.js';
import { RequestLoggerMiddleware } from './logger/request-logger.middleware.js';
import { AdminModule } from './admin/admin.module.js';
import { AutoModule } from './auto/auto.module.js';
import { DevModule } from './dev/dev.module.js';
import { LoggerModule } from './logger/logger.module.js';
import { KeycloakModule } from './security/keycloak/keycloak.module.js';
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(RequestLoggerMiddleware)
            .forRoutes(AutoGetController, AutoWriteController, 'auth', 'graphql');
    }
};
AppModule = __decorate([
    Module({
        imports: [
            TypeOrmModule.forFeature(entities),
            GraphQLModule.forRoot(graphQlModuleOptions),
            TypeOrmModule.forRoot(typeOrmModuleOptions),
            AdminModule,
            AutoModule,
            DevModule,
            LoggerModule,
            KeycloakModule,
        ],
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map