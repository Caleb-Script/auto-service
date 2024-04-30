var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Auto } from './auto.entity.js';
import { DecimalTransformer } from './decimal-transformer.js';
let Ausstattung = class Ausstattung {
    id;
    bezeichnung;
    preis;
    verfuegbar;
    auto;
    toString = () => JSON.stringify({
        id: this.id,
        bezeichnung: this.bezeichnung,
        preis: this.preis,
        verfuegbar: this.verfuegbar,
    });
};
__decorate([
    Column('int'),
    PrimaryGeneratedColumn(),
    __metadata("design:type", Object)
], Ausstattung.prototype, "id", void 0);
__decorate([
    Column('varchar', { unique: true, length: 32 }),
    __metadata("design:type", String)
], Ausstattung.prototype, "bezeichnung", void 0);
__decorate([
    Column('decimal', {
        precision: 8,
        scale: 2,
        transformer: new DecimalTransformer(),
    }),
    ApiProperty({ example: 1, type: Number }),
    __metadata("design:type", Number)
], Ausstattung.prototype, "preis", void 0);
__decorate([
    Column('boolean'),
    ApiProperty({ example: true, type: Boolean }),
    __metadata("design:type", Object)
], Ausstattung.prototype, "verfuegbar", void 0);
__decorate([
    ManyToOne(() => Auto, (auto) => auto.ausstattungen),
    JoinColumn({ name: 'auto_id' }),
    __metadata("design:type", Object)
], Ausstattung.prototype, "auto", void 0);
Ausstattung = __decorate([
    Entity()
], Ausstattung);
export { Ausstattung };
//# sourceMappingURL=ausstattung.entity.js.map