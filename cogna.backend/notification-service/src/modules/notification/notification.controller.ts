import { Controller } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EventPattern } from '@nestjs/microservices';
import { SendOtpEvent } from '@cogna-edu/contracts/gen/events/notification/send_otp';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('notification.send.otp')
  public async sendOtp(data: SendOtpEvent) {
    await this.notificationService.sendOtp(data);
  }
}
