import { DbPopulateService } from './db-populate.service.js';
import { Response } from 'express';
export declare class DevController {
    #private;
    constructor(service: DbPopulateService);
    dbPopulate(res: Response): Promise<Response>;
}
