import { type ArgumentsHost, type ExceptionFilter, HttpException } from '@nestjs/common';
export declare class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, _host: ArgumentsHost): void;
}
