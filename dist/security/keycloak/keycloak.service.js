var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
var KeycloakService_1;
import axios from 'axios';
import { keycloakConnectOptions, paths } from '../../config/keycloak.js';
import { Injectable } from '@nestjs/common';
import { getLogger } from '../../logger/logger.js';
const { authServerUrl, clientId, secret } = keycloakConnectOptions;
let KeycloakService = KeycloakService_1 = class KeycloakService {
    #loginHeaders;
    #keycloakClient;
    #logger = getLogger(KeycloakService_1.name);
    constructor() {
        const authorization = Buffer.from(`${clientId}:${secret}`, 'utf8').toString('base64');
        this.#loginHeaders = {
            Authorization: `Basic ${authorization}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        };
        this.#keycloakClient = axios.create({
            baseURL: authServerUrl,
        });
        this.#logger.debug('keycloakClient=%o', this.#keycloakClient.defaults);
    }
    createKeycloakConnectOptions() {
        return keycloakConnectOptions;
    }
    async login({ username, password }) {
        this.#logger.debug('login: username=%s', username);
        if (username === undefined || password === undefined) {
            return;
        }
        const loginBody = `grant_type=password&username=${username}&password=${password}`;
        let response;
        try {
            response = await this.#keycloakClient.post(paths.accessToken, loginBody, { headers: this.#loginHeaders });
        }
        catch {
            this.#logger.warn('login: Fehler bei %s', paths.accessToken);
            return;
        }
        this.#logPayload(response);
        this.#logger.debug('login: response.data=%o', response.data);
        return response.data;
    }
    async refresh(refresh_token) {
        this.#logger.debug('refresh: refresh_token=%s', refresh_token);
        if (refresh_token === undefined) {
            return;
        }
        const refreshBody = `grant_type=refresh_token&refresh_token=${refresh_token}`;
        let response;
        try {
            response = await this.#keycloakClient.post(paths.accessToken, refreshBody, { headers: this.#loginHeaders });
        }
        catch {
            this.#logger.warn('refresh: Fehler bei POST-Request: path=%s, body=%o', paths.accessToken, refreshBody);
            return;
        }
        this.#logger.debug('refresh: response.data=%o', response.data);
        return response.data;
    }
    #logPayload(response) {
        const { access_token } = response.data;
        const [, payloadStr] = access_token.split('.');
        if (payloadStr === undefined) {
            return;
        }
        const payloadDecoded = atob(payloadStr);
        const payload = JSON.parse(payloadDecoded);
        const { azp, exp, resource_access } = payload;
        this.#logger.debug('#logPayload: exp=%s', exp);
        const { roles } = resource_access[azp];
        this.#logger.debug('#logPayload: roles=%o', roles);
    }
};
KeycloakService = KeycloakService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], KeycloakService);
export { KeycloakService };
//# sourceMappingURL=keycloak.service.js.map