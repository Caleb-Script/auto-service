import { ApolloFederationDriver, } from '@nestjs/apollo';
import { BASEDIR } from '../../app.js';
import path from 'node:path';
const schemaGraphQL = path.join(BASEDIR, 'config', 'resources', 'graphql', 'auto.schema.graphql');
console.debug('schemaGraphQL = %s', schemaGraphQL);
export const graphQlModuleOptions = {
    typePaths: [schemaGraphQL],
    driver: ApolloFederationDriver,
    playground: false,
};
//# sourceMappingURL=graphql.js.map