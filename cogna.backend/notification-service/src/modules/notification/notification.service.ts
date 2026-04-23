import { Injectable, Logger } from '@nestjs/common';
import { MailService } from '../mail-service/mail.service';
import { SendOtpRequest } from '@cogna-edu/contracts/gen/notification/notification';

@Injectable()
export class NotificationService {
  private readonly logger: Logger = new Logger(NotificationService.name);

  constructor(private readonly mailService: MailService) {}

  public async sendOtp(data: SendOtpRequest) {
    const { email } = data;
    await this.mailService.sendOtp(data);
    this.logger.log('send otp', { email });
  }
}
