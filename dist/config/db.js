import { config } from './app.js';
const dbConfig = config.db;
console.debug('dbConfig: %o', dbConfig);
const type = dbConfig?.type;
export const dbType = type === 'postgres' ||
    type === 'mysql' ||
    type === 'oracle' ||
    type === 'sqlite'
    ? type
    : 'postgres';
//# sourceMappingURL=db.js.map