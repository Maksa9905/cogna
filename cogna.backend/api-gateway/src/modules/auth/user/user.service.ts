import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  UserInfoRequest,
  UserInfoResponse,
  UserServiceClient,
} from '@cogna-edu/contracts/gen/auth/user';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  private userGrpcClient: UserServiceClient;

  constructor(@Inject('USER_GRPC') private readonly client: ClientGrpc) {
    this.userGrpcClient = client.getService<UserServiceClient>('UserService');
  }

  public async getUserInfo(dto: UserInfoRequest): Promise<UserInfoResponse> {
    return firstValueFrom(this.userGrpcClient.getUserInfo(dto));
  }
}
