import { type GetriebeType, type HerstellerType } from '../entity/auto.entity.js';
import { AusstattungDTO } from './ausstattungDTO.entity.js';
import { EigentuemerDTO } from './eigentuemerDTO.entity.js';
export declare class AutoDtoOhneRef {
    readonly modellbezeichnung: string;
    readonly hersteller: HerstellerType | undefined;
    readonly fin: string;
    readonly kilometerstand: number | undefined;
    readonly auslieferungstag: Date | string | undefined;
    readonly grundpreis: number;
    readonly istAktuellesModell: boolean | undefined;
    readonly getriebeArt: GetriebeType | undefined;
}
export declare class AutoDTO extends AutoDtoOhneRef {
    readonly eigentuemer: EigentuemerDTO;
    readonly ausstattungen: AusstattungDTO[] | undefined;
}
