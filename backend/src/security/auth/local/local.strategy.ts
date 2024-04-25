import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../service/auth.service.js';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { getLogger } from '../../../logger/logger.js';

/**
 * Implementierung der _lokalen Strategie_ für Passport, so dass zu gegebenem
 * Benutzername und Passwort das `User`-Objekt ermittelt wird, falls das
 * mitgelieferte Passwort korrekt ist.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    readonly #authService: AuthService;

    readonly #logger = getLogger(LocalStrategy.name);

    /**
     * Dependency Injection von AuthService, damit
     * das User-Objekt ermittelt wird, wenn der bereitgestellte Benutzername und das Passwort korrekt sind.
     */
    constructor(authService: AuthService) {
        super();
        this.#authService = authService;
    }

    /**
     * `User`-Objekt ermitteln, falls das mitgelieferte Passwort korrekt ist.
     *
     * @param username Benutzername
     * @param password Passwort
     * @return Das User-Objekt bei erfolgreicher Validierung. Passwort verwendet
     *  den allgemeinen Typ any.^
     * @throws UnauthorizedException
     */
    async validate(username: string, password: string): Promise<any> {
        this.#logger.debug('validate: username=%s, password=*****', username); // NOSONAR
        const user = await this.#authService.validate({
            username,
            pass: password,
        });
        if (user === undefined) {
            this.#logger.debug('validate: user=undefined');
            // Unauthorized, da wir möglichst wenig Informationen herausgeben wollen.
            throw new UnauthorizedException();
        }
        this.#logger.debug('validate: user=%o', user);
        return user;
    }
}
