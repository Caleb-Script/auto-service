<<<<<<< Updated upstream
import { Module } from '@nestjs/common';
import { AutoReadService } from './auto/service/auto-read.service';
import { AutoWriteService } from './auto/service/auto-write.service';
import { graphQlModuleOptions } from './config/ressources/graphql/graphql';
import { typeOrmModuleOptions } from './config/typeormOptions';
=======
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { graphQlModuleOptions } from './config/ressources/graphql/graphql.js';
import { typeOrmModuleOptions } from './config/typeormOptions.js';
>>>>>>> Stashed changes
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { entities } from './auto/entity/entities';
import { AutoMutationResolver } from './auto/graphql/auto-Mutation.resolver';
import { AutoQueryResolver } from './auto/graphql/auto-query.resolver';

@Module({
    imports: [
        TypeOrmModule.forFeature(entities),
        GraphQLModule.forRoot<ApolloDriverConfig>(graphQlModuleOptions),
        TypeOrmModule.forRoot(typeOrmModuleOptions),
    ],
    providers: [
        AutoReadService,
        AutoWriteService,
        AutoQueryResolver,
        AutoMutationResolver,
    ],
})
export class AppModule {}
