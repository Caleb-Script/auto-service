/// <reference types="node" />
import { type KeycloakConnectConfig } from 'nest-keycloak-connect';
import { Agent } from 'node:https';
export declare const keycloakConnectOptions: KeycloakConnectConfig;
export declare const paths: {
    accessToken: string;
    userInfo: string;
    introspect: string;
};
export declare const httpsAgent: Agent;
