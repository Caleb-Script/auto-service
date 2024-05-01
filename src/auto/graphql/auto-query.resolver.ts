import { Args, Query, Resolver } from '@nestjs/graphql';
import {
    AutoReadService,
    Suchkriterien,
} from '../service/auto-read.service.js';
import { getLogger } from '../../logger/logger.js';
import { Auto } from '../entity/auto.entity.js';
import { Public } from 'nest-keycloak-connect';
import { UseFilters, UseInterceptors } from '@nestjs/common';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
import { HttpExceptionFilter } from './http-exception.filter.js';

export interface IdInput {
    readonly id: number;
}

export interface SuchkriterienInput {
    readonly suchkriterien: Suchkriterien | undefined;
}

@Resolver()
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseTimeInterceptor)
export class AutoQueryResolver {
    readonly #service: AutoReadService;
    readonly #logger = getLogger(AutoQueryResolver.name);

    constructor(service: AutoReadService) {
        this.#service = service;
    }

    @Query('auto')
    @Public()
    async getAuto(@Args() { id }: IdInput) {
        this.#logger.debug(`getAuto: id=${id}`);

        const auto: Auto = await this.#service.findById({ id });

        if (this.#logger.isLevelEnabled('debug')) {
            this.#logger.debug(
                'findById: auto=%s, eigentuemer=%o',
                auto.toString(),
                auto.eigentuemer,
            );
        }

        return auto;
    }

    @Query('autos')
    @Public()
    async getAutos(@Args() input: SuchkriterienInput) {
        this.#logger.debug(`getAutos: input=${input}`);
        const autos: Auto[] = await this.#service.find(input?.suchkriterien);
        this.#logger.debug(`getAutos: autos=${autos}`, autos);
        return autos;
    }
}
