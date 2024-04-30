import { Injectable } from '@nestjs/common';
import { Suchkriterien } from './suchkriterien';

@Injectable()
export class AutoReadService {
    find(suchkriterien: Suchkriterien): import("../entity/auto.entity").Auto[] | PromiseLike<import("../entity/auto.entity").Auto[]> {
        throw new Error('Method not implemented.');
    }
<<<<<<< Updated upstream
    findById(arg0: { id: number; }): import("../entity/auto.entity").Auto | PromiseLike<import("../entity/auto.entity").Auto> {
        throw new Error('Method not implemented.');
=======

    /**
     * Ein Auto asynchron anhand seiner ID suchen
     * @param id ID des gesuchten Autos
     * @returns Das gefundene Auto
     * @throws NotFoundException falls kein Auto mit der gesuchten ID gefunden wird
     */
    async findById({id, mitAusstattung = false }: FindByIdParams){
        this.#logger.debug('findById: id=%d', id);

        const auto: Auto | null = await this.#queryBuilder
            .buildId({ id, mitAusstattung })
            .getOne();
        if (auto === null || auto === undefined) {
            throw new NotFoundException(`Es gibt kein Auto mit der ID: ${id}.`);
        }

        if (this.#logger.isLevelEnabled('debug')) {
            this.#logger.debug(
                'findById: auto=%s, eigentuemer=%o',
                auto.toString(),
                auto.eigentuemer,
            );
            if (mitAusstattung) {
                this.#logger.debug(
                    'findById: ausstattung=%o',
                    auto.ausstattungen,
                );
            }
        }
        return auto;
    }

    /**
     * Autos werden asynchron gesucht
     * @param suchkriterien JSON-Objekt mit den gegebenen Suchrkriterien
     * @returns Ein JSON-Array mit den gefundenen Autos
     * @returns NotFoundException falls keine Autos gefunden werden
     */
    async find(suchkriterien?: Suchkriterien): Promise<Auto[]> {
        this.#logger.debug('find: suchkriterien=%o', suchkriterien);

        if (suchkriterien === undefined) {
            return this.#queryBuilder.build({}).getMany();
        }
        const keys = Object.keys(suchkriterien);
        if (keys.length === 0) {
            return this.#queryBuilder.build(suchkriterien).getMany();
        }

        if (!this.#checkKeys(keys)) {
            throw new NotFoundException('Ungueltige Suchkriterien');
        }

        const autos: Auto[] = await this.#queryBuilder.build(suchkriterien).getMany();
        if (autos.length === 0) {
            this.#logger.debug('find: Keine Autos gefunden');
            throw new NotFoundException(
                `Keine Autos gefunden:  ${JSON.stringify(suchkriterien)}`,
            );
        }
        this.#logger.debug('find: autos=%o', autos);
        return autos;
    }

    #checkKeys(keys: string[]) {
        let validKeys = true;
        keys.forEach((key) => {
            if (!this.#autoProps.includes(key)) {
                this.#logger.debug(
                    '#find: ungueltiges Suchkriterium "%s"',
                    key,
                );
                validKeys = false;
            }
        });
        return validKeys;
>>>>>>> Stashed changes
    }
}
