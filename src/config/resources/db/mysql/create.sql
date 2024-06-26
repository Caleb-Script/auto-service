-- Copyright (C) 2022 - present Juergen Zimmermann, Hochschule Karlsruhe
--
-- This program is free software: you can redistribute it and/or modify
-- it under the terms of the GNU General Public License as published by
-- the Free Software Foundation, either version 3 of the License, or
-- (at your option) any later version.
--
-- This program is distributed in the hope that it will be useful,
-- but WITHOUT ANY WARRANTY; without even the implied warranty of
-- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
-- GNU General Public License for more details.
--
-- You should have received a copy of the GNU General Public License
-- along with this program.  If not, see <https://www.gnu.org/licenses/>.

-- https://dev.mysql.com/doc/refman/8.2/en/create-table.html
-- https://dev.mysql.com/doc/refman/8.2/en/data-types.html
-- https://dev.mysql.com/doc/refman/8.2/en/integer-types.html
-- BOOLEAN = TINYINT(1) mit TRUE, true, FALSE, false
-- https://dev.mysql.com/doc/refman/8.2/en/boolean-literals.html
-- https://dev.mysql.com/doc/refman/8.2/en/date-and-time-types.html
-- TIMESTAMP nur zwischen '1970-01-01 00:00:01' und '2038-01-19 03:14:07'
-- https://dev.mysql.com/doc/refman/8.2/en/date-and-time-types.html
-- https://dev.mysql.com/doc/refman/8.2/en/create-table-check-constraints.html
-- https://dev.mysql.com/blog-archive/mysql-8-0-16-introducing-check-constraint
-- UNIQUE: impliziter Index als B+ Baum

CREATE TABLE IF NOT EXISTS auto (
    id                   INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    version              INT NOT NULL DEFAULT 0,
    modellbezeichnung    CHAR(40) NOT NULL,
    hersteller           ENUM('VOLKSWAGEN', 'AUDI', 'DAIMLER', 'RENAULT'),
    fin                  VARCHAR(17) NOT NULL UNIQUE,
    kilometerstand       INT NOT NULL CHECK (kilometerstand>=0),
    auslieferungstag     DATE,
    grundpreis           DECIMAL(8,2) NOT NULL,
    ist_aktuelles_modell BOOLEAN NOT NULL DEFAULT TRUE,
    getriebe_art         ENUM('MANUELL', 'AUTOMATIK'),
    erzeugt              DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP),
    aktualisiert         DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP)
) TABLESPACE autospace ROW_FORMAT=COMPACT;
ALTER TABLE auto AUTO_INCREMENT=1000;

CREATE TABLE IF NOT EXISTS ausstattung (
    id                INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    bezeichnung       VARCHAR(32) NOT NULL,
    preis             DECIMAL(8,2) NOT NULL,
    verfuegbar        BOOLEAN NOT NULL DEFAULT TRUE,
    auto_id           INT NOT NULL references auto(id)
) TABLESPACE autospace ROW_FORMAT=COMPACT;
ALTER TABLE ausstattung AUTO_INCREMENT=1000;

CREATE TABLE IF NOT EXISTS eigentuemer (
    id                     INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    eigentuemer            VARCHAR(40) NOT NULL,
    geburtsdatum           DATE,
    fuehrerscheinnummer    VARCHAR(16) NOT NULL,
    auto_id                INT UNIQUE NOT NULL references auto(id),

    INDEX eigentuemer_auto_id_idx(auto_id)
) TABLESPACE autospace ROW_FORMAT=COMPACT;
ALTER TABLE eigentuemer AUTO_INCREMENT=1000;
