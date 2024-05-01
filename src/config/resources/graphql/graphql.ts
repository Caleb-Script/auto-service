import {
    type ApolloDriverConfig,
    ApolloFederationDriver,
} from '@nestjs/apollo';
import { BASEDIR } from '../../app.js';
import path from 'node:path';

const schemaGraphQL = path.join(
    BASEDIR,
    'config',
    'resources',
    'graphql',
    'auto.schema.graphql',
);
console.debug('schemaGraphQL = %s', schemaGraphQL);

/**
 * Das Konfigurationsobjekt für GraphQL (siehe src\app.module.ts).
 */
export const graphQlModuleOptions: ApolloDriverConfig = {
    typePaths: [schemaGraphQL],
    // alternativ: Mercurius (statt Apollo) fuer Fastify (statt Express)
    // driver: ApolloDriver,
    driver: ApolloFederationDriver,
    playground: false,
    // TODO formatError und logger konfigurieren, damit UserInputError nicht in der Konsole protokolliert wird
};
