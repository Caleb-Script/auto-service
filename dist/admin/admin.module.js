var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { HealthController } from './health.controller.js';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrometheusController } from './prometheus.controller.js';
import { TerminusModule } from '@nestjs/terminus';
let AdminModule = class AdminModule {
};
AdminModule = __decorate([
    Module({
        imports: [TerminusModule, HttpModule],
        controllers: [HealthController, PrometheusController],
    })
], AdminModule);
export { AdminModule };
//# sourceMappingURL=admin.module.js.map