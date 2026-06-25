import { KafkaBaseClient } from './kafka-base.client';
import { SendOtpEvent } from '@cogna-edu/contracts/gen/events/notification/send_otp';

export class KafkaNotificationClient extends KafkaBaseClient {
  public async sendOtp(data: SendOtpEvent) {
    return this.emit('notification.send.otp', data);
  }
}
