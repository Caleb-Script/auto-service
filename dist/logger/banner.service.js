var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var _a;
var BannerService_1;
import { Injectable } from '@nestjs/common';
import { release, type, userInfo } from 'node:os';
import figlet from 'figlet';
import { getLogger } from './logger.js';
import { nodeConfig } from '../config/node.js';
import process from 'node:process';
import { dbType } from '../config/db.js';
let BannerService = BannerService_1 = class BannerService {
    #logger = getLogger(BannerService_1.name);
    onApplicationBootstrap() {
        const { host, nodeEnv, port } = nodeConfig;
        figlet('auto', (_, data) => console.info(data));
        this.#logger.info('Node: %s', process.version);
        this.#logger.info('NODE_ENV: %s', nodeEnv);
        this.#logger.info('Rechnername: %s', host);
        this.#logger.info('Port: %s', port);
        this.#logger.info('DB-System: %s', dbType);
        this.#logger.info('Betriebssystem: %s (%s)', type(), release());
        this.#logger.info('Username: %s', userInfo().username);
        this.#logger.info('Swagger UI: /swagger');
    }
};
BannerService = BannerService_1 = __decorate([
    Injectable()
], BannerService);
export { BannerService };
//# sourceMappingURL=banner.service.js.map