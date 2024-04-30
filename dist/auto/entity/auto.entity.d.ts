import { Ausstattung } from './ausstattung.entity.js';
import { Eigentuemer } from './eigentuemer.entity.js';
export type GetriebeType = 'MANUELL' | 'AUTOMATIK';
export type HerstellerType = 'VOLKSWAGEN' | 'AUDI' | 'DAIMLER' | 'RENAULT';
export declare class Auto {
    id: number | undefined;
    readonly version: number | undefined;
    readonly modellbezeichnung: string;
    readonly hersteller: HerstellerType | undefined;
    readonly fin: string;
    readonly kilometerstand: number | undefined;
    readonly auslieferungstag: Date | string | undefined;
    readonly grundpreis: number;
    readonly istAktuellesModell: boolean | undefined;
    readonly getriebeArt: GetriebeType | undefined;
    readonly erzeugt: Date | undefined;
    readonly aktualisiert: Date | undefined;
    readonly eigentuemer: Eigentuemer | undefined;
    readonly ausstattungen: Ausstattung[] | undefined;
    toString: () => string;
}
