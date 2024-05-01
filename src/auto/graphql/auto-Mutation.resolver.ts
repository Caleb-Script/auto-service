import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthGuard, Roles } from 'nest-keycloak-connect';
import { UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';

import { Ausstattung } from '../entity/ausstattung.entity';
import { Auto } from '../entity/auto.entity';
import { AutoDTO } from '../rest/autoDTO.entity.js';
import { AutoWriteService } from '../service/auto-write.service.js';
import { Eigentuemer } from '../entity/eigentuemer.entity';
import { HttpExceptionFilter } from './http-exception.filter.js';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
import { getLogger } from '../../logger/logger.js';

export interface CreatePayload {
    readonly id: number;
}

export interface UpdatePayload {
    readonly version: number;
}

@Resolver()
@UseGuards(AuthGuard)
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseTimeInterceptor)
export class AutoMutationResolver {
    readonly #service: AutoWriteService;
    readonly #logger = getLogger(AutoMutationResolver.name);

    constructor(service: AutoWriteService) {
        this.#service = service;
    }

    @Mutation()
    @Roles({ roles: ['admin', 'user'] })
    async create(@Args('input') autoDTO: AutoDTO) {
        this.#logger.debug('findById: input=%o', autoDTO);

        const auto = this.#autoDtoToAuto(autoDTO);
        const id = await this.#service.create(auto);
        // TODO BadUserInputError
        const payload: CreatePayload = { id };
        return payload;
    }

    @Mutation()
    @Roles({ roles: ['admin', 'user'] })
    async update(
        @Args('id') id: number,
        @Args('version') version: string,
        @Args('input') autoUpdateDTO: AutoDTO,
    ) {
        this.#logger.debug(`update: id=${id} aktuelleVersion=${version}`);
        const auto = this.#autoUpdateDtoToAuto(autoUpdateDTO);
        const versionStr = `"${version}"`;
        const versionResult = await this.#service.update({
            id,
            auto,
            version: versionStr,
        });
        // TODO BadUserInputError
        const payload: UpdatePayload = { version: versionResult };
        return payload;
    }

    @Mutation()
    @Roles({ roles: ['admin'] })
    async delete(@Args('id') id: number) {
        this.#logger.debug(`delete: id=${id}`);

        return this.#service.delete(id);
    }

    #autoDtoToAuto(autoDTO: AutoDTO): Auto {
        const eigentuemerDTO = autoDTO.eigentuemer;
        const eigentuemer: Eigentuemer = {
            id: undefined,
            eigentuemer: eigentuemerDTO.eigentuemer,
            geburtsdatum: eigentuemerDTO.geburtsdatum,
            fuehrerscheinnummer: eigentuemerDTO.fuehrerscheinnummer,
            auto: undefined,
        };
        const ausstattungen = autoDTO.ausstattungen?.map((ausstattungDTO) => {
            const ausstattung: Ausstattung = {
                id: undefined,
                bezeichnung: ausstattungDTO.bezeichnung,
                preis: ausstattungDTO.preis,
                verfuegbar: ausstattungDTO.verfuegbar,
                auto: undefined,
            };
            return ausstattung;
        });
        const auto: Auto = {
            id: undefined,
            version: undefined,
            fin: autoDTO.fin,
            modellbezeichnung: autoDTO.modellbezeichnung,
            hersteller: autoDTO.hersteller,
            kilometerstand: autoDTO.kilometerstand,
            auslieferungstag: autoDTO.auslieferungstag,
            grundpreis: autoDTO.grundpreis,
            istAktuellesModell: autoDTO.istAktuellesModell,
            getriebeArt: autoDTO.getriebeArt,
            eigentuemer,
            ausstattungen,
            erzeugt: new Date(),
            aktualisiert: new Date(),
        };

        // Rueckwaertsverweis
        auto.eigentuemer!.auto = auto;
        return auto;
    }

    #autoUpdateDtoToAuto(autoDTO: AutoDTO): Auto {
        return {
            id: undefined,
            version: undefined,
            fin: autoDTO.fin,
            modellbezeichnung: autoDTO.modellbezeichnung,
            hersteller: autoDTO.hersteller,
            kilometerstand: autoDTO.kilometerstand,
            auslieferungstag: autoDTO.auslieferungstag,
            grundpreis: autoDTO.grundpreis,
            istAktuellesModell: autoDTO.istAktuellesModell,
            getriebeArt: autoDTO.getriebeArt,
            eigentuemer: undefined,
            ausstattungen: undefined,
            erzeugt: undefined,
            aktualisiert: new Date(),
        };
    }
}
