import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { getLogger } from 'src/logger/logger';
import { AutoWriteService } from 'src/auto/service/auto-write.service';

export interface CreatePayload {
  readonly id: number;
}

export interface UpdatePayload {
  readonly version: number;
}

export class AutoUpdateDTO extends AutoDTO {
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

  @Mutation('auto')
  async update(@Args('input') autoUpdateDTO: AutoUpdateDTO) {
    this.#logger.debug(
      `update: id=${autoUpdateDTO.id} aktuelleVersion=${autoUpdateDTO.version}`,
    );

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

  @Mutation('auto')
  async delete(@Args('id') id) {
    this.#logger.debug(`delete: id=${id}`);

    const deletePerformed = await this.#service.delete(id);
    return deletePerformed;
  }
}
