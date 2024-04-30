import { KeycloakService } from './keycloak.service.js';
export interface LoginInput {
    readonly username: string;
    readonly password: string;
}
export interface RefreshInput {
    readonly refresh_token: string;
}
export declare class LoginResolver {
    #private;
    constructor(keycloakService: KeycloakService);
    login({ username, password }: LoginInput): Promise<Record<string, string | number>>;
    refresh(input: RefreshInput): Promise<Record<string, string | number>>;
}
