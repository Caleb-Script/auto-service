import { config } from './app.js';
import { logLevel } from './logger.js';
const { mail } = config;
const activated = mail?.activated === undefined || mail?.activated === true;
const host = mail?.host ?? 'smtp';
const port = mail?.port ?? 25;
const logger = mail?.log === true;
export const options = {
    host,
    port,
    secure: false,
    priority: 'normal',
    logger,
};
export const mailConfig = {
    activated,
    options,
};
Object.freeze(options);
if (logLevel === 'debug') {
    console.debug('mailConfig = %o', mailConfig);
}
//# sourceMappingURL=mail.js.map