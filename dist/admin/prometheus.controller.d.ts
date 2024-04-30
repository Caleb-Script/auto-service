import { Response } from 'express';
export declare class PrometheusController {
    #private;
    constructor();
    metrics(res: Response<string>): Promise<Response<string, Record<string, any>>>;
}
