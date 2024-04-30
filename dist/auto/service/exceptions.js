import { HttpException, HttpStatus } from '@nestjs/common';
export class FinAlreadyExistsException extends HttpException {
    fin;
    constructor(fin) {
        super(`Es existiert berits ein Auto mit der fin: ${fin}`, HttpStatus.UNPROCESSABLE_ENTITY);
        this.fin = fin;
    }
}
export class VersionInvalidException extends HttpException {
    version;
    constructor(version) {
        super(`ungültige Versionsnummer: ${version}`, HttpStatus.PRECONDITION_FAILED);
        this.version = version;
    }
}
export class VersionOutdatedException extends HttpException {
    version;
    constructor(version) {
        super(`Veraltete Versionsnummer: ${version}`, HttpStatus.PRECONDITION_FAILED);
        this.version = version;
    }
}
//# sourceMappingURL=exceptions.js.map