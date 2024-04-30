import dotenv from 'dotenv';
import process from 'node:process';
dotenv.config();
const { NODE_ENV, CLIENT_SECRET, LOG_LEVEL, START_DB_SERVER } = process.env;
export const env = {
    NODE_ENV,
    CLIENT_SECRET,
    LOG_LEVEL,
    START_DB_SERVER,
};
console.debug('NODE_ENV = %s', NODE_ENV);
//# sourceMappingURL=env.js.map