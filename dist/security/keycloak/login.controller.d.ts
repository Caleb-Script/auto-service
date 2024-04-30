import { KeycloakService } from './keycloak.service.js';
import { Response } from 'express';
export declare class Login {
    username: string | undefined;
    password: string | undefined;
}
export declare class Refresh {
    refresh_token: string | undefined;
}
export declare class LoginController {
    #private;
    constructor(keycloakService: KeycloakService);
    login({ username, password }: Login, res: Response): Promise<Response<any, Record<string, any>>>;
    refresh(body: Refresh, res: Response): Promise<Response<any, Record<string, any>>>;
}
