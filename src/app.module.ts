import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AdminModule } from './admin/admin.module.js';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { AutoGetController } from './auto/rest/auto-get.controller.js';
import { AutoModule } from './auto/auto.module.js';
import { AutoWriteController } from './auto/rest/auto-write.controller.js';
import { DevModule } from './config/dev/dev.module.js';
import { GraphQLModule } from '@nestjs/graphql';
import { KeycloakModule } from './security/keycloak/keycloak.module.js';
import { LoggerModule } from './logger/logger.module.js';

import { RequestLoggerMiddleware } from './logger/request-logger.middleware.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './auto/entity/entities.js';
import { graphQlModuleOptions } from './config/resources/graphql/graphql.js';
import { typeOrmModuleOptions } from './config/typeormOptions.js';

@Module({
    imports: [
        TypeOrmModule.forFeature(entities),
        GraphQLModule.forRoot<ApolloDriverConfig>(graphQlModuleOptions),
        TypeOrmModule.forRoot(typeOrmModuleOptions),
        AdminModule,
        AutoModule,
        DevModule,
        LoggerModule,
        KeycloakModule,
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(RequestLoggerMiddleware)
            .forRoutes(
                AutoGetController,
                AutoWriteController,
                'auth',
                'graphql',
            );
    }
}
