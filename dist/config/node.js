import { RESOURCES_DIR, config } from './app.js';
import { env } from './env.js';
import { hostname } from 'node:os';
import { httpsOptions } from './https.js';
const { NODE_ENV } = env;
const computername = hostname();
const port = config.node?.port ?? 3000;
export const nodeConfig = {
    host: computername,
    port,
    resourcesDir: RESOURCES_DIR,
    httpsOptions,
    nodeEnv: NODE_ENV,
};
//# sourceMappingURL=node.js.map