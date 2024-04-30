import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { graphQlModuleOptions } from './config/resources/graphql/graphql.js';
import { typeOrmModuleOptions } from './config/typeormOptions.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { entities } from './auto/entity/entities.js';
import { AutoGetController } from './auto/rest/auto-get.controller.js';
import { AutoWriteController } from './auto/rest/auto-write.controller.js';
import { RequestLoggerMiddleware } from './logger/request-logger.middleware.js';
import { AdminModule } from './admin/admin.module.js';
import { AutoModule } from './auto/auto.module.js';
import { DevModule } from './dev/dev.module.js';
import { LoggerModule } from './logger/logger.module.js';
import { KeycloakModule } from './security/keycloak/keycloak.module.js';

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
