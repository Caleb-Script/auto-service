import { Auto, type GetriebeType, type HerstellerType } from '../entity/auto.entity.js';
import { type Ausstattung } from '../entity/ausstattung.entity.js';
import { QueryBuilder } from './query-builder.js';
export interface FindByIdParams {
    readonly id: number;
    readonly mitAusstattung?: boolean;
}
export interface Suchkriterien {
    readonly modellbezeichnung?: string;
    readonly hersteller?: HerstellerType;
    readonly fin?: string;
    readonly kilometerstand?: number;
    readonly auslieferungstag?: Date;
    readonly grundpreis?: number;
    readonly istAktuellesModell?: boolean;
    readonly getriebeArt?: GetriebeType;
    readonly eigentuemer?: string;
    readonly ausstattung?: Ausstattung;
}
export declare class AutoReadService {
    #private;
    static readonly ID_PATTERN: RegExp;
    constructor(queryBuilder: QueryBuilder);
    findById({ id, mitAusstattung }: FindByIdParams): Promise<Auto>;
    find(suchkriterien?: Suchkriterien): Promise<Auto[]>;
}
