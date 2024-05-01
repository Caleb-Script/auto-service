/* eslint-disable @stylistic/quotes */
/*
 * Copyright (C) 2021 - present Juergen Zimmermann, Florian Goebel, Hochschule Karlsruhe
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * Das Modul enthält die Funktion, um die Test-DB neu zu laden.
 * @packageDocumentation
 */

import { Injectable, type OnApplicationBootstrap } from '@nestjs/common';
import {
    adminDataSourceOptions,
    dbPopulate,
    dbResourcesDir,
    typeOrmModuleOptions,
} from '../typeormOptions.js';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { dbType } from '../db.js';
import { getLogger } from '../../logger/logger.js';
import path from 'node:path';
import { readFileSync } from 'node:fs';

/**
 * Die Test-DB wird im Development-Modus neu geladen, nachdem die Module
 * initialisiert sind, was durch `OnApplicationBootstrap` realisiert wird.
 *
 * DB-Migration mit TypeORM (ohne Nest): https://typeorm.io/migrations
 */
@Injectable()
export class DbPopulateService implements OnApplicationBootstrap {
    readonly #tabellen = ['auto', 'eigentuemer', 'ausstattung'];

    readonly #datasource: DataSource;

    readonly #resourcesDir = dbResourcesDir;

    readonly #logger = getLogger(DbPopulateService.name);

    /**
     * Initialisierung durch DI mit `DataSource` für SQL-Queries.
     */
    constructor(@InjectDataSource() dataSource: DataSource) {
        this.#datasource = dataSource;
    }

    /**
     * Die Test-DB wird im Development-Modus neu geladen.
     */
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
        this.#logger.debug('dropScript = %s', dropScript); // eslint-disable-line sonarjs/no-duplicate-string
        // https://nodejs.org/api/fs.html#fs_fs_readfilesync_path_options
        const dropStatements = readFileSync(dropScript, 'utf8'); // eslint-disable-line security/detect-non-literal-fs-filename,n/no-sync
        await this.#datasource.query(dropStatements);

        const createScript = path.resolve(this.#resourcesDir, 'create.sql'); // eslint-disable-line sonarjs/no-duplicate-string
        this.#logger.debug('createScript = %s', createScript); // eslint-disable-line sonarjs/no-duplicate-string
        // https://nodejs.org/api/fs.html#fs_fs_readfilesync_path_options
        const createStatements = readFileSync(createScript, 'utf8'); // eslint-disable-line security/detect-non-literal-fs-filename,n/no-sync
        await this.#datasource.query(createStatements);

        // COPY zum Laden von CSV-Dateien erfordert Administrationsrechte
        // https://www.postgresql.org/docs/current/sql-copy.html

        // https://typeorm.io/data-source
        const dataSource = new DataSource(adminDataSourceOptions!);
        await dataSource.initialize();
        await dataSource.query(
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            `SET search_path TO ${adminDataSourceOptions!.database};`,
        );
        const copyStmt =
            "COPY %TABELLE% FROM '/csv/%TABELLE%.csv' (FORMAT csv, DELIMITER ';', HEADER true);";
        for (const tabelle of this.#tabellen) {
            // eslint-disable-next-line unicorn/prefer-string-replace-all
            await dataSource.query(copyStmt.replace(/%TABELLE%/gu, tabelle));
        }
        await dataSource.destroy();
    }

    async #populateMySQL() {
        // repo.query() kann bei MySQL nur 1 Anweisung mit "raw SQL" ausfuehren
        const dropScript = path.resolve(this.#resourcesDir, 'drop.sql');
        this.#logger.debug('dropScript = %s', dropScript);
        await this.#executeStatements(dropScript);

        const createScript = path.resolve(this.#resourcesDir, 'create.sql');
        this.#logger.debug('createScript = %s', createScript);
        await this.#executeStatements(createScript);

        // LOAD DATA zum Laden von CSV-Dateien erfordert Administrationsrechte
        // https://dev.mysql.com/doc/refman/8.2/en/load-data.html

        // https://typeorm.io/data-source
        const dataSource = new DataSource(adminDataSourceOptions!);
        await dataSource.initialize();
        await dataSource.query(
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            `USE ${adminDataSourceOptions!.database};`,
        );
        const copyStmt =
            "LOAD DATA INFILE '/var/lib/mysql-files/%TABELLE%.csv' " +
            "INTO TABLE %TABELLE% FIELDS TERMINATED BY ';' " +
            "ENCLOSED BY '\"' LINES TERMINATED BY '\\n' IGNORE 1 ROWS;";
        for (const tabelle of this.#tabellen) {
            // eslint-disable-next-line unicorn/prefer-string-replace-all
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
        // repo.query() kann bei SQLite nur 1 Anweisung mit "raw SQL" ausfuehren
        await this.#executeStatements(dropScript);

        const createScript = path.resolve(this.#resourcesDir, 'create.sql');
        await this.#executeStatements(createScript);

        const insertScript = path.resolve(this.#resourcesDir, 'insert.sql');
        await this.#executeStatements(insertScript);
    }

    async #executeStatements(script: string, removeSemi = false) {
        // https://stackoverflow.com/questions/6156501/read-a-file-one-line-at-a-time-in-node-js#answer-17332534
        // alternativ: https://nodejs.org/api/fs.html#fspromisesopenpath-flags-mode
        const statements: string[] = [];
        let statement = '';
        readFileSync(script, 'utf8') // eslint-disable-line security/detect-non-literal-fs-filename,n/no-sync
            // bei Zeilenumbruch einen neuen String erstellen
            .split(/\r?\n/u)
            // Kommentarzeilen entfernen
            .filter((line) => !line.includes('--'))
            // Eine Anweisung aus mehreren Zeilen bis zum Semikolon zusammenfuegen
            .forEach((line) => {
                statement += line;
                if (line.endsWith(';')) {
                    if (removeSemi) {
                        statements.push(statement.slice(0, -1));
                    } else {
                        statements.push(statement);
                    }
                    statement = '';
                }
            });

        for (statement of statements) {
            await this.#datasource.query(statement);
        }
    }
}
/* eslint-enable @stylistic/quotes */
