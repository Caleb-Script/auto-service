import { UseGuards, UseFilters, UseInterceptors } from '@nestjs/common';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthGuard, Roles } from 'nest-keycloak-connect';
import { ResponseTimeInterceptor } from '../../logger/response-time.interceptor.js';
import { Ausstattung } from '../entity/ausstattung.entity';
import { Auto } from '../entity/auto.entity';
import { Eigentuemer } from '../entity/eigentuemer.entity';
import { AutoDTO } from '../rest/autoDTO.entity.js';
import { AutoWriteService } from '../service/auto-write.service.js';
import { HttpExceptionFilter } from './http-exception.filter.js';
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

    @Mutation()
    @Roles({ roles: ['admin'] })
    async delete(@Args('id') id: number) {
        this.#logger.debug(`delete: id=${id}`);

        const deletePerformed = await this.#service.delete(id);
        return deletePerformed;
    }
}
