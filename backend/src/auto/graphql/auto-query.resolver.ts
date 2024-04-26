import { Args, Query, Resolver } from '@nestjs/graphql';
import {
    AutoReadService,
    Suchkriterien,
} from '../service/auto-read.service.js';
import { getLogger } from '../../logger/logger.js';
import { Auto } from '../entity/auto.entity.js';

export interface SuchkriterienInput {
    readonly suchkriterien: Suchkriterien;
}

@Resolver()
export class AutoQueryResolver {
    readonly #service: AutoReadService;
    readonly #logger = getLogger(AutoQueryResolver.name);

    constructor(service: AutoReadService) {
        this.#service = service;
    }

    @Query('auto')
    async getAuto(@Args('id') id: number) {
        this.#logger.debug(`findById: id=${id}`);

        const auto: Auto = await this.#service.findById({ id });

        this.#logger.debug(`findById: auto=${auto}, titel=${auto.eigentuemer}`);

        return auto;
    }

    @Query('autos')
    async getAutos(@Args() input: SuchkriterienInput) {
        this.#logger.debug(`findById: input=${input}`);

        const autos: Auto[] = await this.#service.find(input?.suchkriterien);
        this.#logger.debug(`find: kunden=${autos}`, autos);
        return autos;
    }
}
