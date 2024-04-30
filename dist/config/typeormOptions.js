import { BASEDIR, config } from './app.js';
import { OracleNamingStrategy, SnakeNamingStrategy, } from './typeormNamingStrategy.js';
import { Auto } from '../auto/entity/auto.entity.js';
import { dbType } from './db.js';
import { entities } from '../auto/entity/entities.js';
import { logLevel } from './logger.js';
import { nodeConfig } from './node.js';
import path from 'node:path';
import { readFileSync } from 'node:fs';
const { db } = config;
const database = db?.name ?? Auto.name.toLowerCase();
const host = db?.host ?? 'localhost';
const username = db?.username ?? Auto.name.toLowerCase();
const pass = db?.password ?? 'p';
const passAdmin = db?.passwordAdmin ?? 'p';
const namingStrategy = dbType === 'oracle'
    ? new OracleNamingStrategy()
    : new SnakeNamingStrategy();
const logging = (nodeConfig.nodeEnv === 'development' || nodeConfig.nodeEnv === 'test') &&
    logLevel === 'debug';
const logger = 'advanced-console';
export const dbResourcesDir = path.resolve(nodeConfig.resourcesDir, 'db', dbType);
console.debug('dbResourcesDir = %s', dbResourcesDir);
let dataSourceOptions;
switch (dbType) {
    case 'postgres': {
        const cert = readFileSync(path.resolve(dbResourcesDir, 'certificate.cer'));
        dataSourceOptions = {
            type: 'postgres',
            host,
            port: 5432,
            username,
            password: pass,
            database,
            schema: username,
            poolSize: 10,
            entities,
            namingStrategy,
            logging,
            logger,
            ssl: { cert },
            extra: {
                ssl: {
                    rejectUnauthorized: false,
                },
            },
        };
        break;
    }
    case 'mysql': {
        const cert = readFileSync(path.resolve(dbResourcesDir, 'certificate.cer'));
        dataSourceOptions = {
            type: 'mysql',
            host,
            port: 3306,
            username,
            password: pass,
            database,
            poolSize: 10,
            entities,
            namingStrategy,
            supportBigNumbers: true,
            logging,
            logger,
            ssl: { cert },
            extra: {
                ssl: {
                    rejectUnauthorized: false,
                },
            },
        };
        break;
    }
    case 'oracle': {
        dataSourceOptions = {
            type: 'oracle',
            host,
            port: 1521,
            username,
            password: pass,
            database: 'FREEPDB1',
            serviceName: 'freepdb1',
            schema: username.toUpperCase(),
            poolSize: 10,
            entities,
            namingStrategy,
            logging,
            logger,
        };
        break;
    }
    case 'sqlite': {
        const sqliteDatabase = path.resolve(BASEDIR, 'config', 'resources', 'db', 'sqlite', `${database}.sqlite`);
        dataSourceOptions = {
            type: 'better-sqlite3',
            database: sqliteDatabase,
            entities,
            namingStrategy,
            logging,
            logger,
        };
        break;
    }
}
Object.freeze(dataSourceOptions);
export const typeOrmModuleOptions = dataSourceOptions;
if (logLevel === 'debug') {
    const { password, ssl, ...typeOrmModuleOptionsLog } = typeOrmModuleOptions;
    console.debug('typeOrmModuleOptions = %o', typeOrmModuleOptionsLog);
}
export const dbPopulate = db?.populate === true;
let adminDataSourceOptionsTemp;
if (dbType === 'postgres') {
    const cert = readFileSync(path.resolve(dbResourcesDir, 'certificate.cer'));
    adminDataSourceOptionsTemp = {
        type: 'postgres',
        host,
        port: 5432,
        username: 'postgres',
        password: passAdmin,
        database,
        schema: database,
        namingStrategy,
        logging,
        logger,
        ssl: { cert },
        extra: {
            ssl: {
                rejectUnauthorized: false,
            },
        },
    };
}
else if (dbType === 'mysql') {
    const cert = readFileSync(path.resolve(dbResourcesDir, 'certificate.cer'));
    adminDataSourceOptionsTemp = {
        type: 'mysql',
        host,
        port: 3306,
        username: 'root',
        password: passAdmin,
        database,
        namingStrategy,
        supportBigNumbers: true,
        logging,
        logger,
        ssl: { cert },
        extra: {
            ssl: {
                rejectUnauthorized: false,
            },
        },
    };
}
export const adminDataSourceOptions = adminDataSourceOptionsTemp;
//# sourceMappingURL=typeormOptions.js.map