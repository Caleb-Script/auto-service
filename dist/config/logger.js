import { config } from './app.js';
import { env } from './env.js';
import path from 'node:path';
import pino from 'pino';
const logDirDefault = 'log';
const logFileNameDefault = 'server.log';
const logFileDefault = path.resolve(logDirDefault, logFileNameDefault);
const { log } = config;
const logDir = log?.dir === undefined
    ? undefined
    : log.dir.trimEnd();
const logFile = logDir === undefined
    ? logFileDefault
    : path.resolve(logDir, logFileNameDefault);
const pretty = log?.pretty === true;
let logLevelTmp = 'info';
if (env.LOG_LEVEL !== undefined) {
    logLevelTmp = env.LOG_LEVEL;
}
else if (log?.level !== undefined) {
    logLevelTmp = log?.level;
}
export const logLevel = logLevelTmp;
console.debug(`logger config: logLevel=${logLevel}, logFile=${logFile}, pretty=${pretty}`);
const fileOptions = {
    level: logLevel,
    target: 'pino/file',
    options: { destination: logFile },
};
const prettyOptions = {
    translateTime: 'SYS:standard',
    singleLine: true,
    colorize: true,
    ignore: 'pid,hostname',
};
const prettyTransportOptions = {
    level: logLevel,
    target: 'pino-pretty',
    options: prettyOptions,
};
const options = pretty
    ? {
        targets: [fileOptions, prettyTransportOptions],
    }
    : {
        targets: [fileOptions],
    };
const transports = pino.transport(options);
export const parentLogger = logLevel === 'info'
    ? pino(pino.destination(logFileDefault))
    : pino({ level: logLevel }, transports);
//# sourceMappingURL=logger.js.map