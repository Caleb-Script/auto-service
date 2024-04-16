import { Injectable } from '@nestjs/common';
import { Suchkriterien } from './suchkriterien';

@Injectable()
export class AutoReadService {
    find(suchkriterien: Suchkriterien): import("../entity/auto.entity").Auto[] | PromiseLike<import("../entity/auto.entity").Auto[]> {
        throw new Error('Method not implemented.');
    }
    findById(arg0: { id: number; }): import("../entity/auto.entity").Auto | PromiseLike<import("../entity/auto.entity").Auto> {
        throw new Error('Method not implemented.');
    }
}
