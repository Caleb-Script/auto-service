var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator, } from '@nestjs/terminus';
import { Public } from 'nest-keycloak-connect';
let HealthController = class HealthController {
    #health;
    #typeorm;
    constructor(health, typeorm) {
        this.#health = health;
        this.#typeorm = typeorm;
    }
    live() {
        return this.#health.check([
            () => ({
                appserver: {
                    status: 'up',
                },
            }),
        ]);
    }
    ready() {
        return this.#health.check([() => this.#typeorm.pingCheck('db')]);
    }
};
__decorate([
    Get('liveness'),
    HealthCheck(),
    ApiOperation({ summary: 'Liveness überprüfen' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "live", null);
__decorate([
    Get('readiness'),
    HealthCheck(),
    ApiOperation({ summary: 'Readiness überprüfen' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "ready", null);
HealthController = __decorate([
    Controller('health'),
    Public(),
    ApiTags('Health'),
    __metadata("design:paramtypes", [HealthCheckService, TypeOrmHealthIndicator])
], HealthController);
export { HealthController };
//# sourceMappingURL=health.controller.js.map