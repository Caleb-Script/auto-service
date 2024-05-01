/**
 * Dieses Modul enthält die DTO Entity-Klasse Ausstattung ohne TypeORM.
 * @packageDocumentation
 */

import { ApiProperty } from '@nestjs/swagger';
import { MaxLength } from 'class-validator';

/**
 * Entity-Klasse für Ausstattung ohne TypeORM.
 */
export class AusstattungDTO {
    /* eslint-disable @typescript-eslint/no-magic-numbers */
    @MaxLength(32)
    @ApiProperty({ example: 'Sonderlackierung', type: String })
    readonly bezeichnung!: string;

    @ApiProperty({ example: 1, type: Number })
    readonly preis!: number;

    @ApiProperty({ example: true, type: Boolean })
    readonly verfuegbar!: boolean;
}
/* eslint-enable @typescript-eslint/no-magic-numbers */
