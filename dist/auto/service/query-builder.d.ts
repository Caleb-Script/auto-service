import { Auto } from '../entity/auto.entity.js';
import { Repository } from 'typeorm';
import { type Suchkriterien } from './auto-read.service.js';
export interface BuildIdParams {
    readonly id: number;
    readonly mitAusstattung?: boolean;
}
export declare class QueryBuilder {
    #private;
    constructor(repo: Repository<Auto>);
    buildId({ id, mitAusstattung }: BuildIdParams): import("typeorm").SelectQueryBuilder<Auto>;
    build({ eigentuemer, ausstattung, ...props }: Suchkriterien): import("typeorm").SelectQueryBuilder<Auto>;
}
