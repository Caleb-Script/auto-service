var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
var DbPopulateService_1;
import { Injectable } from '@nestjs/common';
import { adminDataSourceOptions, dbPopulate, dbResourcesDir, typeOrmModuleOptions, } from '../typeormOptions.js';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { dbType } from '../db.js';
import { getLogger } from '../../logger/logger.js';
import path from 'node:path';
import { readFileSync } from 'node:fs';
let DbPopulateService = DbPopulateService_1 = class DbPopulateService {
    #tabellen = ['auto', 'eigentuemer', 'ausstattung'];
    #datasource;
    #resourcesDir = dbResourcesDir;
    #logger = getLogger(DbPopulateService_1.name);
    constructor(dataSource) {
        this.#datasource = dataSource;
    }
    async onApplicationBootstrap() {
        await this.populateTestdaten();
    }
    async populateTestdaten() {
        if (!dbPopulate) {
            return;
        }
        this.#logger.warn(`${typeOrmModuleOptions.type}: DB wird neu geladen`);
        switch (dbType) {
            case 'postgres': {
                await this.#populatePostgres();
                break;
            }
            case 'mysql': {
                await this.#populateMySQL();
                break;
            }
            case 'oracle': {
                await this.#populateOracle();
                break;
            }
            case 'sqlite': {
                await this.#populateSQLite();
                break;
            }
        }
        this.#logger.warn('DB wurde neu geladen');
    }
    async #populatePostgres() {
        const dropScript = path.resolve(this.#resourcesDir, 'drop.sql');
        this.#logger.debug('dropScript = %s', dropScript);
        const dropStatements = readFileSync(dropScript, 'utf8');
        await this.#datasource.query(dropStatements);
        const createScript = path.resolve(this.#resourcesDir, 'create.sql');
        this.#logger.debug('createScript = %s', createScript);
        const createStatements = readFileSync(createScript, 'utf8');
        await this.#datasource.query(createStatements);
        const dataSource = new DataSource(adminDataSourceOptions);
        await dataSource.initialize();
        await dataSource.query(`SET search_path TO ${adminDataSourceOptions.database};`);
        const copyStmt = "COPY %TABELLE% FROM '/csv/%TABELLE%.csv' (FORMAT csv, DELIMITER ';', HEADER true);";
        for (const tabelle of this.#tabellen) {
            await dataSource.query(copyStmt.replace(/%TABELLE%/gu, tabelle));
        }
        await dataSource.destroy();
    }
    async #populateMySQL() {
        const dropScript = path.resolve(this.#resourcesDir, 'drop.sql');
        this.#logger.debug('dropScript = %s', dropScript);
        await this.#executeStatements(dropScript);
        const createScript = path.resolve(this.#resourcesDir, 'create.sql');
        this.#logger.debug('createScript = %s', createScript);
        await this.#executeStatements(createScript);
        const dataSource = new DataSource(adminDataSourceOptions);
        await dataSource.initialize();
        await dataSource.query(`USE ${adminDataSourceOptions.database};`);
        const copyStmt = "LOAD DATA INFILE '/var/lib/mysql-files/%TABELLE%.csv' " +
            "INTO TABLE %TABELLE% FIELDS TERMINATED BY ';' " +
            "ENCLOSED BY '\"' LINES TERMINATED BY '\\n' IGNORE 1 ROWS;";
        for (const tabelle of this.#tabellen) {
            await dataSource.query(copyStmt.replace(/%TABELLE%/gu, tabelle));
        }
        await dataSource.destroy();
    }
    async #populateOracle() {
        const dropScript = path.resolve(this.#resourcesDir, 'drop.sql');
        this.#logger.debug('dropScript = %s', dropScript);
        await this.#executeStatements(dropScript, true);
        const createScript = path.resolve(this.#resourcesDir, 'create.sql');
        this.#logger.debug('createScript = %s', createScript);
        await this.#executeStatements(createScript, true);
    }
    async #populateSQLite() {
        const dropScript = path.resolve(this.#resourcesDir, 'drop.sql');
        await this.#executeStatements(dropScript);
        const createScript = path.resolve(this.#resourcesDir, 'create.sql');
        await this.#executeStatements(createScript);
        const insertScript = path.resolve(this.#resourcesDir, 'insert.sql');
        await this.#executeStatements(insertScript);
    }
    async #executeStatements(script, removeSemi = false) {
        const statements = [];
        let statement = '';
        readFileSync(script, 'utf8')
            .split(/\r?\n/u)
            .filter((line) => !line.includes('--'))
            .forEach((line) => {
            statement += line;
            if (line.endsWith(';')) {
                if (removeSemi) {
                    statements.push(statement.slice(0, -1));
                }
                else {
                    statements.push(statement);
                }
                statement = '';
            }
        });
        for (statement of statements) {
            await this.#datasource.query(statement);
        }
    }
};
DbPopulateService = DbPopulateService_1 = __decorate([
    Injectable(),
    __param(0, InjectDataSource()),
    __metadata("design:paramtypes", [DataSource])
], DbPopulateService);
export { DbPopulateService };
//# sourceMappingURL=db-populate.service.js.map