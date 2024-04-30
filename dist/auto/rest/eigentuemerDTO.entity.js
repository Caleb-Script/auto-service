var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class EigentuemerDTO {
    eigentuemer;
    geburtsdatum;
    fuehrerscheinnummer;
}
__decorate([
    MaxLength(40),
    ApiProperty({ example: 'Edsger Dijkstra', type: String }),
    __metadata("design:type", String)
], EigentuemerDTO.prototype, "eigentuemer", void 0);
__decorate([
    IsOptional(),
    ApiProperty({ example: '2001-01-01' }),
    __metadata("design:type", Object)
], EigentuemerDTO.prototype, "geburtsdatum", void 0);
__decorate([
    IsOptional(),
    MaxLength(20),
    ApiProperty({ example: '1234567890' }),
    __metadata("design:type", Object)
], EigentuemerDTO.prototype, "fuehrerscheinnummer", void 0);
//# sourceMappingURL=eigentuemerDTO.entity.js.map