import { Args, Query, Resolver } from '@nestjs/graphql';
import { Auto } from 'src/auto/entity/auto.entity';
import { getLogger } from 'src/logger/logger';
import { AutoReadService } from 'src/auto/service/auto-read.service';
import { Suchkriterien } from 'src/auto/service/suchkriterien';

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
  async getAuto(@Args('id') id) {
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
