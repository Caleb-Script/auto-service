var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, } from 'typeorm';
import { Auto } from './auto.entity.js';
let Eigentuemer = class Eigentuemer {
    id;
    eigentuemer;
    geburtsdatum;
    fuehrerscheinnummer;
    auto;
    toString = () => JSON.stringify({
        id: this.id,
        eigentuemer: this.eigentuemer,
        geburtsdatum: this.geburtsdatum,
        fuehrerscheinnummer: this.fuehrerscheinnummer,
    });
};
__decorate([
    Column('int'),
    PrimaryGeneratedColumn(),
    __metadata("design:type", Object)
], Eigentuemer.prototype, "id", void 0);
__decorate([
    Column('varchar', { unique: true, length: 50 }),
    __metadata("design:type", String)
], Eigentuemer.prototype, "eigentuemer", void 0);
__decorate([
    Column('date'),
    __metadata("design:type", Object)
], Eigentuemer.prototype, "geburtsdatum", void 0);
__decorate([
    Column('varchar', { length: 20 }),
    __metadata("design:type", Object)
], Eigentuemer.prototype, "fuehrerscheinnummer", void 0);
__decorate([
    OneToOne(() => Auto, (auto) => auto.eigentuemer),
    JoinColumn({ name: 'auto_id' }),
    __metadata("design:type", Object)
], Eigentuemer.prototype, "auto", void 0);
Eigentuemer = __decorate([
    Entity()
], Eigentuemer);
export { Eigentuemer };
//# sourceMappingURL=eigentuemer.entity.js.map