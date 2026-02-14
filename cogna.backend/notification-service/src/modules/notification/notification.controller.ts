import { Controller } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EventPattern } from '@nestjs/microservices';
import { SendOtpRequest } from '@cogna-edu/contracts/gen/notification';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('notification.send.otp')
  public async sendOtp(data: SendOtpRequest) {
    await this.notificationService.sendOtp(data);
  }
}
