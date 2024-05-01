/**
 * Dieses Modul enthält die DTO Entity-Klasse Eigentuemer ohne TypeORM.
 * @packageDocumentation
 */

import { IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
/**
 * Entity-Klasse für einen Eigentuemer ohne TypeORM.
 */
export class EigentuemerDTO {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    @MaxLength(40)
    @ApiProperty({ example: 'Edsger Dijkstra', type: String })
    readonly eigentuemer!: string;

    @IsOptional()
    @ApiProperty({ example: '2001-01-01' })
    readonly geburtsdatum: Date | string | undefined;

    @IsOptional()
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    @MaxLength(20)
    @ApiProperty({ example: '1234567890' })
    readonly fuehrerscheinnummer: string | undefined;
}
