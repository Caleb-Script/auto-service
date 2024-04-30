export interface SendMailParams {
    readonly subject: string;
    readonly body: string;
}
export declare class MailService {
    #private;
    sendmail({ subject, body }: SendMailParams): Promise<void>;
}
