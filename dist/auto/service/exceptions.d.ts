import { HttpException } from '@nestjs/common';
export declare class FinAlreadyExistsException extends HttpException {
    readonly fin: string;
    constructor(fin: string);
}
export declare class VersionInvalidException extends HttpException {
    readonly version: string | undefined;
    constructor(version: string | undefined);
}
export declare class VersionOutdatedException extends HttpException {
    readonly version: number;
    constructor(version: number);
}
