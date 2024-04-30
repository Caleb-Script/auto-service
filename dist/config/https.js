import { RESOURCES_DIR } from './app.js';
import path from 'node:path';
import { readFileSync } from 'node:fs';
const tlsDir = path.resolve(RESOURCES_DIR, 'tls');
console.debug('tlsDir = %s', tlsDir);
export const httpsOptions = {
    key: readFileSync(path.resolve(tlsDir, 'key.pem')),
    cert: readFileSync(path.resolve(tlsDir, 'certificate.crt')),
};
//# sourceMappingURL=https.js.map