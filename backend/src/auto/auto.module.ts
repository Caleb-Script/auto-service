
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


/**
 * Das Modul besteht aus Controller- und Service-Klassen für die Verwaltung von
 * Bücher.
 * @packageDocumentation
 */

/**
 * Die dekorierte Modul-Klasse mit Controller- und Service-Klassen sowie der
 * Funktionalität für TypeORM.
 */
@Module({
    imports: [KeycloakModule, MailModule, TypeOrmModule.forFeature(entities)],
    controllers: [AutoGetController, AutoWriteController],
    // Provider sind z.B. Service-Klassen fuer DI
    providers: [
        AutoReadService,
        AutoWriteService,
        AutoQueryResolver,
        AutoMutationResolver,
        QueryBuilder,
    ],
    // Export der Provider fuer DI in anderen Modulen
    exports: [AutoReadService, AutoWriteService],
})
export class AutoModule {}
