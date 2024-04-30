var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var _a;
var MailService_1;
import { Injectable } from '@nestjs/common';
import { getLogger } from '../logger/logger.js';
import { mailConfig } from '../config/mail.js';
let MailService = MailService_1 = class MailService {
    #logger = getLogger(MailService_1.name);
    async sendmail({ subject, body }) {
        if (!mailConfig.activated) {
            this.#logger.warn('#sendmail: Mail deaktiviert');
            return;
        }
        const from = '"Joe Doe" <Joe.Doe@acme.com>';
        const to = '"Foo Bar" <Foo.Bar@acme.com>';
        const data = { from, to, subject, html: body };
        this.#logger.debug('#sendMail: data=%o', data);
        try {
            const nodemailer = await import('nodemailer');
            await nodemailer.createTransport(mailConfig.options).sendMail(data);
        }
        catch (err) {
            this.#logger.warn('#sendmail: Fehler %o', err);
        }
    }
};
MailService = MailService_1 = __decorate([
    Injectable()
], MailService);
export { MailService };
//# sourceMappingURL=mail.service.js.map