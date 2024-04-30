var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Res } from '@nestjs/common';
import { Public } from 'nest-keycloak-connect';
import client from 'prom-client';
let PrometheusController = class PrometheusController {
    #register;
    #contentType;
    constructor() {
        const { Registry } = client;
        this.#register = new Registry();
        this.#contentType = this.#register.contentType;
        const { collectDefaultMetrics } = client;
        client.collectDefaultMetrics({
            prefix: 'node_',
            gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
            register: this.#register,
        });
        collectDefaultMetrics({ register: this.#register });
    }
    async metrics(res) {
        const metrics = await this.#register.metrics();
        return res.contentType(this.#contentType).send(metrics);
    }
};
__decorate([
    Get(''),
    __param(0, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PrometheusController.prototype, "metrics", null);
PrometheusController = __decorate([
    Controller('metrics'),
    Public(),
    __metadata("design:paramtypes", [])
], PrometheusController);
export { PrometheusController };
//# sourceMappingURL=prometheus.controller.js.map