import { Injectable, Logger } from '@nestjs/common';
import { MailService } from '../mail-service/mail.service';
import { SendOtpEvent } from '@cogna-edu/contracts/gen/events/notification/send_otp';

@Injectable()
export class NotificationService {
  private readonly logger: Logger = new Logger(NotificationService.name);

  constructor(private readonly mailService: MailService) {}

  public async sendOtp(data: SendOtpEvent) {
    const { email } = data;
    await this.mailService.sendOtp(data);
    this.logger.log('send otp', { email });
  }
}
