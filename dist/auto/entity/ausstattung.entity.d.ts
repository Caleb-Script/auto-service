import { Auto } from './auto.entity.js';
export declare class Ausstattung {
    id: number | undefined;
    readonly bezeichnung: string;
    readonly preis: number;
    readonly verfuegbar: boolean | undefined;
    auto: Auto | undefined;
    toString: () => string;
}
