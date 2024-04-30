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

-- docker compose exec postgres bash
-- psql --dbname=buch --username=buch --file=/scripts/create-table-buch.sql

-- Indexe mit pgAdmin auflisten: "Query Tool" verwenden mit
--  SELECT   tablename, indexname, indexdef, tablespace
--  FROM     pg_indexes
--  WHERE    schemaname = 'buch'
--  ORDER BY tablename, indexname;

-- https://www.postgresql.org/docs/devel/app-psql.html
-- https://www.postgresql.org/docs/current/ddl-schemas.html
-- https://www.postgresql.org/docs/current/ddl-schemas.html#DDL-SCHEMAS-CREATE
-- "user-private schema" (Default-Schema: public)
CREATE SCHEMA IF NOT EXISTS AUTHORIZATION auto;
ALTER ROLE auto SET search_path = 'auto';

CREATE TYPE getriebeType AS ENUM ('MANUELL', 'AUTOMATIK');
CREATE TYPE herstellerType AS ENUM ('VOLKSWAGEN', 'AUDI', 'DAIMLER', 'RENAULT');

CREATE TABLE IF NOT EXISTS auto (
    id                  integer GENERATED ALWAYS AS IDENTITY(START WITH 1000) PRIMARY KEY USING INDEX TABLESPACE autospace,
    version             integer NOT NULL DEFAULT 0,
    modellbezeichnung   varchar(40) NOT NULL,
    hersteller          herstellerType,
    fin                 varchar(17) NOT NULL UNIQUE USING INDEX TABLESPACE autospace,
    kilometerstand      integer NOT NULL CHECK (kilometerstand >= 0),
    auslieferungstag    date,
    grundpreis          decimal(8,2) NOT NULL,
    ist_aktuelles_modell  boolean NOT NULL DEFAULT TRUE,
    getriebe_art             getriebeType,
    erzeugt             timestamp NOT NULL DEFAULT NOW(),
    aktualisiert        timestamp NOT NULL DEFAULT NOW()
) TABLESPACE autospace;

CREATE TABLE IF NOT EXISTS ausstattung (
    id                  integer GENERATED ALWAYS AS IDENTITY(START WITH 1000) PRIMARY KEY USING INDEX TABLESPACE autospace,
    bezeichnung         varchar(32) NOT NULL,
    preis               decimal(8,2) NOT NULL,
    verfuegbar          boolean NOT NULL DEFAULT TRUE,
    auto_id             integer NOT NULL REFERENCES auto
) TABLESPACE autospace;

CREATE INDEX IF NOT EXISTS ausstattung_auto_id_idx ON ausstattung(auto_id) TABLESPACE autospace;

ALTER TABLE
    ausstattung DROP CONSTRAINT ausstattung_auto_id_fkey,
ADD
    CONSTRAINT ausstattung_auto_id_fkey FOREIGN KEY (auto_id) REFERENCES auto(id) ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS eigentuemer (
    id                  integer GENERATED ALWAYS AS IDENTITY(START WITH 1000) PRIMARY KEY USING INDEX TABLESPACE autospace,
    eigentuemer         varchar(40) NOT NULL,
    geburtsdatum        date,
    fuehrerscheinnummer varchar(40),
    auto_id             integer NOT NULL UNIQUE USING INDEX TABLESPACE autospace REFERENCES auto
) TABLESPACE autospace;
