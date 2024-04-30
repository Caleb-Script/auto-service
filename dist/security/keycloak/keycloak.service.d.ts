import { type KeycloakConnectOptions, type KeycloakConnectOptionsFactory } from 'nest-keycloak-connect';
interface Login {
    readonly username: string | undefined;
    readonly password: string | undefined;
}
export declare class KeycloakService implements KeycloakConnectOptionsFactory {
    #private;
    constructor();
    createKeycloakConnectOptions(): KeycloakConnectOptions;
    login({ username, password }: Login): Promise<Record<string, string | number> | undefined>;
    refresh(refresh_token: string | undefined): Promise<Record<string, string | number> | undefined>;
}
export {};
