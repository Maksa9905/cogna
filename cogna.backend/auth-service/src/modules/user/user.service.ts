import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import {
  UserInfoRequest,
  UserInfoResponse,
} from '@cogna-edu/contracts/gen/auth/user';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async getUserInfo(dto: UserInfoRequest): Promise<UserInfoResponse> {
    const user = await this.userRepository.getUserInfo(dto.userId);
    if (!user)
      throw new RpcException({
        code: 404,
        message: 'User not found',
      });
    return { userId: user.id, email: user.email };
  }
}
