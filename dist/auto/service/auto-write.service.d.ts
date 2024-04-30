import { Repository } from 'typeorm';
import { Auto } from '../entity/auto.entity.js';
import { AutoReadService } from './auto-read.service.js';
import { MailService } from '../../mail/mail.service.js';
export interface UpdateParams {
    readonly id: number | undefined;
    readonly auto: Auto;
    readonly version: string;
}
export declare class AutoWriteService {
    #private;
    private static readonly VERSION_PATTERN;
    constructor(repo: Repository<Auto>, readService: AutoReadService, mailService: MailService);
    create(auto: Auto): Promise<number>;
    update({ id, auto, version }: UpdateParams): Promise<number>;
    delete(id: number): Promise<boolean>;
}
