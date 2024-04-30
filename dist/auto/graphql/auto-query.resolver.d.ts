import { AutoReadService, Suchkriterien } from '../service/auto-read.service.js';
import { Auto } from '../entity/auto.entity.js';
export interface IdInput {
    readonly id: number;
}
export interface SuchkriterienInput {
    readonly suchkriterien: Suchkriterien | undefined;
}
export declare class AutoQueryResolver {
    #private;
    constructor(service: AutoReadService);
    getAuto({ id }: IdInput): Promise<Auto>;
    getAutos(input: SuchkriterienInput): Promise<Auto[]>;
}
