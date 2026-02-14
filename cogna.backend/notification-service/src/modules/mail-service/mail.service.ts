import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, SentMessageInfo } from 'nodemailer';
import * as nodemailer from 'nodemailer';
import { SendOtpRequest } from '@cogna-edu/contracts/gen/notification';

@Injectable()
export class MailService {
  private transporter: Transporter;
  private readonly from: string;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: configService.getOrThrow<string>('SMTP_HOST'),
      port: configService.getOrThrow<number>('SMTP_PORT'),
      secure: configService.getOrThrow<boolean>('SMTP_SECURE'),
      auth: {
        user: configService.getOrThrow<string>('SMTP_USER'),
        pass: configService.getOrThrow<string>('SMTP_PASS'),
      },
    });
    const user = configService.getOrThrow<string>('SMTP_USER');
    this.from = `Cogna <${user}>`;
  }

  private async sendMail(option: {
    to: string;
    subject: string;
    text: string;
    html: string;
  }): Promise<SentMessageInfo> {
    const { to, subject, text, html } = option;
    return this.transporter.sendMail({
      from: this.from,
      to,
      subject,
      text,
      html,
    });
  }

  public async sendOtp(data: SendOtpRequest): Promise<SentMessageInfo> {
    const { email, otp } = data;
    const subject = 'Код подтверждения — Cogna';
    const text = `Ваш код подтверждения: ${otp}. Никому не сообщайте этот код. Действителен ограниченное время.`;
    const html = this.buildOtpEmailHtml(otp);
    return await this.sendMail({ to: email, subject, text, html });
  }

  private buildOtpEmailHtml(otp: number): string {
    return `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background-color:#f4f4f5;color:#1a1a1a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:480px;margin:0 auto;padding:40px 20px;">
    <tr>
      <td style="background-color:#ffffff;border-radius:12px;padding:40px 32px;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
        <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#6b7280;letter-spacing:0.02em;text-transform:uppercase;">Cogna</p>
        <h1 style="margin:0 0 24px;font-size:22px;font-weight:600;color:#111827;line-height:1.3;">Подтверждение почты</h1>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#374151;">Используйте код ниже для завершения регистрации:</p>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px 24px;text-align:center;margin-bottom:24px;">
          <span style="font-size:28px;font-weight:700;letter-spacing:8px;color:#0f172a;font-variant-numeric:tabular-nums;">${otp}</span>
        </div>
        <p style="margin:0;font-size:13px;line-height:1.5;color:#6b7280;">Никому не сообщайте этот код. Если вы не запрашивали его — просто проигнорируйте письмо. Код действителен ограниченное время.</p>
        <p style="margin:24px 0 0;font-size:12px;color:#9ca3af;">С уважением,<br>команда Cogna</p>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();
  }
}
