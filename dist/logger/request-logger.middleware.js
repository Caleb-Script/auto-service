var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var _a;
var RequestLoggerMiddleware_1;
import { Injectable } from '@nestjs/common';
import { getLogger } from './logger.js';
let RequestLoggerMiddleware = RequestLoggerMiddleware_1 = class RequestLoggerMiddleware {
    #logger = getLogger(RequestLoggerMiddleware_1.name);
    use(req, _res, next) {
        const { method, originalUrl, headers } = req;
        this.#logger.debug('method=%s, url=%s, header=%o', method, originalUrl, headers);
        next();
    }
};
RequestLoggerMiddleware = RequestLoggerMiddleware_1 = __decorate([
    Injectable()
], RequestLoggerMiddleware);
export { RequestLoggerMiddleware };
//# sourceMappingURL=request-logger.middleware.js.map