import { AutoDTO } from '../rest/autoDTO.entity.js';
import { AutoWriteService } from '../service/auto-write.service.js';
export interface CreatePayload {
    readonly id: number;
}
export interface UpdatePayload {
    readonly version: number;
}
export declare class AutoMutationResolver {
    #private;
    constructor(service: AutoWriteService);
    create(autoDTO: AutoDTO): Promise<CreatePayload>;
    update(id: number, version: string, autoUpdateDTO: AutoDTO): Promise<UpdatePayload>;
    delete(id: number): Promise<boolean>;
}
