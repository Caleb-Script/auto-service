import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { getLogger } from 'nodemailer/lib/shared';
import { AutoWriteService } from '../service/auto-write.service';

export interface CreatePayload {
  readonly id: number;
}

export interface UpdatePayload {
  readonly version: number;
}

export class extends AutoDTO {
  readonly id!: number;
  readonly version!: number;
}

@Resolver()
export class AutoMutationResolver {
  readonly #service: AutoWriteService;
  readonly #logger = getLogger(AutoMutationResolver.name);

  constructor(service: AutoWriteService) {
    this.#service = service;
  }

  @Mutation('auto')
  async create(@Args('input') autoDTO: AutoDTO) {
    this.#logger.debug(`findById: input=${autoDTO}`);

    const auto = this.#autoDtoToAuto(autoDTO);
    const id = await this.#service.create(auto);
    // TODO BadUserInputError
    const payload: CreatePayload = { id };
    return payload;
  }
  
  #autoDtoToAuto(autoDTO: AutoDTO) {
    throw new Error('Method not implemented.');
  }


  @Mutation('auto')
  async update(@Args('input') autoUpdateDTO: AutoUpdateDTO) {
    this.#logger.debug(
      `update: id=${autoUpdateDTO.id} aktuelleVersion=${autoUpdateDTO.version}`,
    );
=======
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
            ausstattungen: ausstattungen,
            erzeugt: new Date(),
            aktualisiert: new Date(),
        };


    const auto = this.#autoUpdateDtoToAuto(autoDTO);
    const versionStr = `"${autoDTO.version}"`;
    const versionResult = await this.#service.update({
      id: autoDTO.id,
      auto,
      version: versionStr,
    });
    // TODO BadUserInputError
    const payload: UpdatePayload = { version: versionResult };
    return payload;
  }
  #autoUpdateDtoToAuto(autoDTO: any) {
    throw new Error('Method not implemented.');
  }

  @Mutation('auto')
  async delete(@Args('id') id : number) {
    this.#logger.debug(`delete: id=${id}`);

    const deletePerformed = await this.#service.delete(id);
    return deletePerformed;
  }
}
