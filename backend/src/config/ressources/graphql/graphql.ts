import {
    ApolloFederationDriver,
    type ApolloDriverConfig,
} from '@nestjs/apollo';
import { BASEDIR } from '../../app.js';
import { join } from 'node:path';

<<<<<<< Updated upstream
const schemaGraphQL = join(BASEDIR, 'config', 'graphql', 'auto.schema.graphql');
=======
const schemaGraphQL = join(BASEDIR, 'config','ressources', 'graphql', 'auto.schema.graphql');
>>>>>>> Stashed changes
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
