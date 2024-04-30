import { Module } from '@nestjs/common';
import { AutoReadService } from './service/auto-read.service';
import { AutoWriteService } from './service/auto-write.service';
import { AutoQueryResolver } from './resolver/auto-query.resolver';
import { graphQlModuleOptions } from './config/graphql/graphql';
import { typeOrmModuleOptions } from './config/typeormOptions';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { entities } from './entity/entities';
import { AutoMutationResolver } from './resolver/auto-Mutation.resolver';

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
