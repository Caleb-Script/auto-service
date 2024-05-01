import { Args, Query, Resolver } from '@nestjs/graphql';
import {
    AutoReadService,
    Suchkriterien,
} from '../service/auto-read.service.js';
import { UseFilters, UseInterceptors } from '@nestjs/common';
import { Auto } from '../entity/auto.entity.js';
import { HttpExceptionFilter } from './http-exception.filter.js';
import { Public } from 'nest-keycloak-connect';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
import { getLogger } from '../../logger/logger.js';

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
        this.#logger.debug(`getAutos: input=${JSON.stringify(input)}`);
        const autos: Auto[] = await this.#service.find(input.suchkriterien);
        this.#logger.debug(`getAutos: autos=${JSON.stringify(autos)}`);
        return autos;
    }
}
