import pino from 'pino';
type LogLevel = 'error' | 'warn' | 'info' | 'debug';
export declare const logLevel: LogLevel;
export declare const parentLogger: pino.Logger<string>;
export {};
