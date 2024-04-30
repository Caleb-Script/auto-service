import { config } from './app';
const dbConfig = config.db;
const type = dbConfig?.type;
export const dbType = type === 'postgres' || type === 'mysql' || type === 'sqlite'
    ? type
    : 'postgres';
//# sourceMappingURL=dbType.js.map