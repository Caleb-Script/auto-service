import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AutoWriteService } from '../service/auto-write.service';
import { AutoDTO } from '../rest/autoDTO.entity';
import { Auto } from '../entity/auto.entity';
import { Eigentuemer } from '../entity/eigentuemer.entity';
import { Ausstattung } from '../entity/ausstattung.entity';
import { getLogger } from '../../logger/logger';
import { IsNumberString } from 'class-validator';

export interface CreatePayload {
    readonly id: number;
}

export interface UpdatePayload {
    readonly version: number;
}

export class AutoUpdateDTO extends AutoDTO {
    @IsNumberString()
    readonly id!: string;
    readonly version!: number;
}

@Resolver()
export class AutoMutationResolver {
    readonly #service: AutoWriteService;
    readonly #logger = getLogger(AutoMutationResolver.name);

    constructor(service: AutoWriteService) {
        this.#service = service;
    }

    @Mutation()
    async create(@Args('input') autoDTO: AutoDTO) {
        this.#logger.debug(`findById: input=${autoDTO}`);

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
    async update(@Args('input') autoUpdateDTO: AutoUpdateDTO) {
        this.#logger.debug(
            `update: id=${autoUpdateDTO.id} aktuelleVersion=${autoUpdateDTO.version}`,
        );

        const auto = this.#autoUpdateDtoToAuto(autoUpdateDTO);
        const versionStr = `"${autoUpdateDTO.version}"`;
        const versionResult = await this.#service.update({
            id: Number.parseInt(autoUpdateDTO.id, 10),
            auto,
            version: versionStr,
        });
        // TODO BadUserInputError
        const payload: UpdatePayload = { version: versionResult };
        return payload;
    }
    #autoUpdateDtoToAuto(autoDTO: AutoUpdateDTO): Auto {
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
    async delete(@Args('id') id: number) {
        this.#logger.debug(`delete: id=${id}`);

        const deletePerformed = await this.#service.delete(id);
        return deletePerformed;
    }
}
