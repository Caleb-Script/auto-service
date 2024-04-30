import { Auto } from './auto.entity.js';
export declare class Eigentuemer {
    id: number | undefined;
    readonly eigentuemer: string;
    readonly geburtsdatum: Date | string | undefined;
    readonly fuehrerscheinnummer: string | undefined;
    auto: Auto | undefined;
    toString: () => string;
}
