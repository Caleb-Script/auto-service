import { type DataSourceOptions } from 'typeorm';
export declare const dbResourcesDir: string;
export declare const typeOrmModuleOptions: import("typeorm/driver/mysql/MysqlConnectionOptions.js").MysqlConnectionOptions | import("typeorm/driver/postgres/PostgresConnectionOptions.js").PostgresConnectionOptions | import("typeorm/driver/oracle/OracleConnectionOptions.js").OracleConnectionOptions | import("typeorm/driver/better-sqlite3/BetterSqlite3ConnectionOptions.js").BetterSqlite3ConnectionOptions;
export declare const dbPopulate: boolean;
export declare const adminDataSourceOptions: DataSourceOptions | undefined;
