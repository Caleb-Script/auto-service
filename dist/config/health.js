import { config } from './app.js';
import { logLevel } from './logger.js';
const prettyPrint = config.health?.prettyPrint;
export const healthConfig = {
    prettyPrint: prettyPrint !== undefined && prettyPrint.toLowerCase() === 'true',
};
if (logLevel === 'debug') {
    console.debug('healthConfig: %o', healthConfig);
}
//# sourceMappingURL=health.js.map