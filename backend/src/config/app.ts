import { existsSync, readFileSync } from 'node:fs';
import { load } from 'js-yaml';
import { resolve } from 'node:path';

export const BASEDIR = existsSync('src') ? 'src' : 'dist';

export const RESOURCES_DIR = resolve(BASEDIR, 'config', 'ressources');

const configFile = resolve(RESOURCES_DIR, 'app.yml');
export const config = load(readFileSync(configFile, 'utf8')) as Record<
    string,
    any
>;
