import { ApolloFederationDriver, } from '@nestjs/apollo';
import { BASEDIR } from '../../app.js';
import { join } from 'node:path';
const schemaGraphQL = join(BASEDIR, 'config', 'resources', 'graphql', 'auto.schema.graphql');
console.debug('schemaGraphQL = %s', schemaGraphQL);
export const graphQlModuleOptions = {
    typePaths: [schemaGraphQL],
    driver: ApolloFederationDriver,
    playground: false,
};
//# sourceMappingURL=graphql.js.map