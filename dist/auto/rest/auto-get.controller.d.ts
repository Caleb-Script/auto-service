import { type Auto, type GetriebeType, HerstellerType } from '../../auto/entity/auto.entity.js';
import { AutoReadService, type Suchkriterien } from '../service/auto-read.service.js';
import { Request, Response } from 'express';
import { type Eigentuemer } from '../entity/eigentuemer.entity.js';
export interface Link {
    readonly href: string;
}
export interface Links {
    readonly self: Link;
    readonly list?: Link;
    readonly add?: Link;
    readonly update?: Link;
    readonly remove?: Link;
}
export type EigentuemerModel = Omit<Eigentuemer, 'auto' | 'id'>;
export type AutoModel = Omit<Auto, 'eigentuemer' | 'ausstattungen' | 'aktualisiert' | 'erzeugt' | 'id' | 'version'> & {
    eigentuemer: EigentuemerModel;
    _links: Links;
};
export interface AutosModel {
    _embedded: {
        autos: AutoModel[];
    };
}
export declare class AutoQuery implements Suchkriterien {
    readonly modellbezeichnung: string;
    readonly hersteller: HerstellerType;
    readonly fin: string;
    readonly kilometerstand: number;
    readonly auslieferungstag: Date;
    readonly grundpreis: number;
    readonly istAktuellesModell: boolean;
    readonly getriebeArt: GetriebeType;
    readonly eigentuemer: string;
}
export declare class AutoGetController {
    #private;
    constructor(service: AutoReadService);
    getById(idStr: string, req: Request, version: string | undefined, res: Response): Promise<Response<AutoModel | undefined>>;
    get(query: AutoQuery, req: Request, res: Response): Promise<Response<AutosModel | undefined>>;
}
