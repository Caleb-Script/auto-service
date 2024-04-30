import { AutoDTO, AutoDtoOhneRef } from './autoDTO.entity.js';
import { Request, Response } from 'express';
import { AutoWriteService } from '../service/auto-write.service.js';
export declare class AutoWriteController {
    #private;
    constructor(service: AutoWriteService);
    post(autoDTO: AutoDTO, req: Request, res: Response): Promise<Response>;
    put(autoDTO: AutoDtoOhneRef, id: number, version: string | undefined, res: Response): Promise<Response>;
    delete(id: number): Promise<void>;
}
