import { BASEDIR, config } from './app.js';
import { SnakeNamingStrategy } from './typeormNamingStrategy.js';
import { type DataSourceOptions } from 'typeorm';
//import { nodeConfig } from './node.js';
import { resolve } from 'node:path';
import { dbType } from './dbType.js';
import { Auto } from '../auto/entity/auto.entity.js';
import { entities } from '../auto/entity/entities.js';

const { db } = config;

// nullish coalescing
const database = (db?.name as string | undefined) ?? Auto.name.toLowerCase();

const host = (db?.host as string | undefined) ?? 'localhost';
const username =
  (db?.username as string | undefined) ?? Auto.name.toLowerCase();
const pass = (db?.password as string | undefined) ?? 'p';
const passAdmin = (db?.passwordAdmin as string | undefined) ?? 'p';
const schema = (db?.schema as string | undefined) ?? 'auto';

const namingStrategy = new SnakeNamingStrategy();

// TODO records als "deeply immutable data structure" (Stage 2)
// https://github.com/tc39/proposal-record-tuple
let dataSourceOptions: DataSourceOptions;
switch (dbType) {
  case 'postgres': {
    dataSourceOptions = {
      type: 'postgres',
      host,
      port: 5432,
      username,
      password: pass,
      database,
      schema,
      poolSize: 10,
      entities,
      namingStrategy,
    };
    break;
  }
  case 'mysql': {
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
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    };
    break;
  }
  // 'better-sqlite3' erfordert Python zum Uebersetzen, wenn das Docker-Image gebaut wird
  case 'sqlite': {
    const sqliteDatabase = resolve(
      BASEDIR,
      'config',
      'resources',
      'db',
      'sqlite',
      `${database}.sqlite`,
    );
    dataSourceOptions = {
      type: 'better-sqlite3',
      database: sqliteDatabase,
      entities,
      namingStrategy,
    };
    break;
  }
}
Object.freeze(dataSourceOptions);
export const typeOrmModuleOptions = dataSourceOptions;

export const dbPopulate = db?.populate === true;
let adminDataSourceOptionsTemp: DataSourceOptions | undefined;
if (dbType === 'postgres') {
  adminDataSourceOptionsTemp = {
    type: 'postgres',
    host,
    port: 5432,
    username: 'postgres',
    password: passAdmin,
    database,
    schema,
    namingStrategy,
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  };
} else if (dbType === 'mysql') {
  adminDataSourceOptionsTemp = {
    type: 'mysql',
    host,
    port: 3306,
    username: 'root',
    password: passAdmin,
    database,
    namingStrategy,
    supportBigNumbers: true,
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  };
}
export const adminDataSourceOptions = adminDataSourceOptionsTemp;
