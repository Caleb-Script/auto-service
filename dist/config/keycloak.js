import { PolicyEnforcementMode, TokenValidation, } from 'nest-keycloak-connect';
import { Agent } from 'node:https';
import { config } from './app.js';
import { env } from './env.js';
import { httpsOptions } from './https.js';
const { keycloak } = config;
const authServerUrl = keycloak?.authServerUrl ?? 'http://localhost:8080';
const realm = keycloak?.realm ?? 'acme';
const clientId = keycloak?.clientId ?? 'auto-client';
const tokenValidation = keycloak?.tokenValidation ??
    TokenValidation.ONLINE;
const { CLIENT_SECRET, NODE_ENV } = env;
export const keycloakConnectOptions = {
    authServerUrl,
    realm,
    clientId,
    secret: CLIENT_SECRET ??
        'ERROR: Umgebungsvariable CLIENT_SECRET nicht gesetzt!',
    policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
    tokenValidation,
};
if (NODE_ENV === 'development') {
    console.debug('keycloakConnectOptions = %o', keycloakConnectOptions);
}
else {
    const { secret, ...keycloakConnectOptionsLog } = keycloakConnectOptions;
    console.debug('keycloakConnectOptions = %o', keycloakConnectOptionsLog);
}
export const paths = {
    accessToken: `realms/${realm}/protocol/openid-connect/token`,
    userInfo: `realms/${realm}/protocol/openid-connect/userinfo`,
    introspect: `realms/${realm}/protocol/openid-connect/token/introspect`,
};
export const httpsAgent = new Agent({
    requestCert: true,
    rejectUnauthorized: false,
    ca: httpsOptions.cert,
});
//# sourceMappingURL=keycloak.js.map