import { KafkaBaseClient } from './kafka-base.client';
import { SendOtpRequest } from '@cogna-edu/contracts/gen/notification/notification';

export class KafkaNotificationClient extends KafkaBaseClient {
  public async sendOtp(data: SendOtpRequest) {
    return this.emit('notification.send.otp', data);
  }
}
