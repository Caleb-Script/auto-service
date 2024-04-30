var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsAlphanumeric, IsArray, IsBoolean, IsISO8601, IsNumber, IsOptional, IsPositive, IsString, Length, Matches, MaxLength, Min, ValidateNested, } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AusstattungDTO } from './ausstattungDTO.entity.js';
import { EigentuemerDTO } from './eigentuemerDTO.entity.js';
import { Type } from 'class-transformer';
export class AutoDtoOhneRef {
    modellbezeichnung;
    hersteller;
    fin;
    kilometerstand;
    auslieferungstag;
    grundpreis;
    istAktuellesModell;
    getriebeArt;
}
__decorate([
    IsString(),
    MaxLength(40),
    ApiProperty({ example: 'Mustang' }),
    __metadata("design:type", String)
], AutoDtoOhneRef.prototype, "modellbezeichnung", void 0);
__decorate([
    Matches(/^VOLKSWAGEN$|^AUDI$|^DAIMLER$|^RENAULT$/u),
    IsOptional(),
    ApiProperty({ example: 'AUDI', type: String }),
    __metadata("design:type", Object)
], AutoDtoOhneRef.prototype, "hersteller", void 0);
__decorate([
    IsString(),
    IsAlphanumeric(),
    Length(17),
    ApiProperty({ example: '1HGCM82633A400195' }),
    __metadata("design:type", String)
], AutoDtoOhneRef.prototype, "fin", void 0);
__decorate([
    IsNumber(),
    Min(0),
    ApiProperty({ example: 50_000, type: Number }),
    __metadata("design:type", Object)
], AutoDtoOhneRef.prototype, "kilometerstand", void 0);
__decorate([
    IsISO8601({ strict: true }),
    IsOptional(),
    ApiProperty({ example: '2023-12-15' }),
    __metadata("design:type", Object)
], AutoDtoOhneRef.prototype, "auslieferungstag", void 0);
__decorate([
    IsPositive(),
    ApiProperty({ example: 50_000.5, type: Number }),
    __metadata("design:type", Number)
], AutoDtoOhneRef.prototype, "grundpreis", void 0);
__decorate([
    IsBoolean(),
    ApiProperty({ example: true, type: Boolean }),
    __metadata("design:type", Object)
], AutoDtoOhneRef.prototype, "istAktuellesModell", void 0);
__decorate([
    Matches(/^MANUELL$|^AUTOMATIK$/u),
    IsOptional(),
    ApiProperty({ example: 'MANUELL', type: String }),
    __metadata("design:type", Object)
], AutoDtoOhneRef.prototype, "getriebeArt", void 0);
export class AutoDTO extends AutoDtoOhneRef {
    eigentuemer;
    ausstattungen;
}
__decorate([
    ValidateNested(),
    Type(() => EigentuemerDTO),
    ApiProperty({ type: EigentuemerDTO }),
    __metadata("design:type", EigentuemerDTO)
], AutoDTO.prototype, "eigentuemer", void 0);
__decorate([
    IsOptional(),
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => AusstattungDTO),
    ApiProperty({ type: [AusstattungDTO] }),
    __metadata("design:type", Object)
], AutoDTO.prototype, "ausstattungen", void 0);
//# sourceMappingURL=autoDTO.entity.js.map