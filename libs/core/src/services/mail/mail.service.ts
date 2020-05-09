import * as sgApi from '@sendgrid/mail';

export type IEmailRecipient = string | { name?: string; email: string };

export interface ISendMail {
  to: IEmailRecipient | IEmailRecipient[];
  from: IEmailRecipient | IEmailRecipient[];
  subject?: string;
  text?: string;
  html?: string;
  templateId?: string;
  params?: {
    [key: string]: string;
  };
}

export class MailService {
  private sendgrid = sgApi;

  constructor() {
    this.sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
    this.sendgrid.setSubstitutionWrappers('{{', '}}');
  }

  async sendMail(mail: ISendMail) {
    if (process.env.NODE_ENV === 'test') return;
    if (!mail.templateId && !mail.subject) throw new Error('Either templateId or subject must be present');

    const mailObject = {
      to: mail.to,
      from: mail.from,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
      templateId: mail.templateId,
      substitutions: mail.params,
      dynamic_template_data: mail.params,
    };

    await this.sendgrid.send(mailObject as never, false);
  }
}
