var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn, } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Ausstattung } from './ausstattung.entity.js';
import { DecimalTransformer } from './decimal-transformer.js';
import { Eigentuemer } from './eigentuemer.entity.js';
let Auto = class Auto {
    id;
    version;
    modellbezeichnung;
    hersteller;
    fin;
    kilometerstand;
    auslieferungstag;
    grundpreis;
    istAktuellesModell;
    getriebeArt;
    erzeugt;
    aktualisiert;
    eigentuemer;
    ausstattungen;
    toString = () => JSON.stringify({
        id: this.id,
        version: this.version,
        modellbezeichnung: this.modellbezeichnung,
        hersteller: this.hersteller,
        fin: this.fin,
        kilometerstand: this.kilometerstand,
        auslieferungstag: this.auslieferungstag,
        grundpreis: this.grundpreis,
        istAktuellesModell: this.istAktuellesModell,
        getriebeArt: this.getriebeArt,
    });
};
__decorate([
    Column('int'),
    PrimaryGeneratedColumn(),
    __metadata("design:type", Object)
], Auto.prototype, "id", void 0);
__decorate([
    VersionColumn(),
    __metadata("design:type", Object)
], Auto.prototype, "version", void 0);
__decorate([
    Column('varchar', { unique: true, length: 40 }),
    ApiProperty({ example: 'Golf' }),
    __metadata("design:type", String)
], Auto.prototype, "modellbezeichnung", void 0);
__decorate([
    Column('varchar', { length: 10 }),
    ApiProperty({ example: 'Audi' }),
    __metadata("design:type", Object)
], Auto.prototype, "hersteller", void 0);
__decorate([
    Column('varchar', { unique: true, length: 17 }),
    ApiProperty({ example: '1HGCM82633A123456' }),
    __metadata("design:type", String)
], Auto.prototype, "fin", void 0);
__decorate([
    Column('int'),
    ApiProperty({ example: 1000, type: Number }),
    __metadata("design:type", Object)
], Auto.prototype, "kilometerstand", void 0);
__decorate([
    Column('date'),
    ApiProperty({ example: '2001-01-01' }),
    __metadata("design:type", Object)
], Auto.prototype, "auslieferungstag", void 0);
__decorate([
    Column('decimal', {
        precision: 8,
        scale: 2,
        transformer: new DecimalTransformer(),
    }),
    ApiProperty({ example: 1, type: Number }),
    __metadata("design:type", Number)
], Auto.prototype, "grundpreis", void 0);
__decorate([
    Column('boolean'),
    ApiProperty({ example: true, type: Boolean }),
    __metadata("design:type", Object)
], Auto.prototype, "istAktuellesModell", void 0);
__decorate([
    Column('varchar', { length: 9 }),
    ApiProperty({ example: 'MANUELL', type: String }),
    __metadata("design:type", Object)
], Auto.prototype, "getriebeArt", void 0);
__decorate([
    CreateDateColumn({
        type: 'timestamp',
    }),
    __metadata("design:type", Object)
], Auto.prototype, "erzeugt", void 0);
__decorate([
    UpdateDateColumn({
        type: 'timestamp',
    }),
    __metadata("design:type", Object)
], Auto.prototype, "aktualisiert", void 0);
__decorate([
    OneToOne(() => Eigentuemer, (eigentuemer) => eigentuemer.auto, {
        cascade: ['insert', 'remove'],
    }),
    __metadata("design:type", Object)
], Auto.prototype, "eigentuemer", void 0);
__decorate([
    OneToMany(() => Ausstattung, (ausstattung) => ausstattung.auto, {
        cascade: ['insert', 'remove'],
    }),
    __metadata("design:type", Object)
], Auto.prototype, "ausstattungen", void 0);
Auto = __decorate([
    Entity()
], Auto);
export { Auto };
//# sourceMappingURL=auto.entity.js.map