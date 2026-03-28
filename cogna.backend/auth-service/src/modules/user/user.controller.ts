
import { UserServiceControllerMethods } from '@cogna-edu/contracts/dist/auth/user';
import { GrpcService } from '@nestjs/microservices';
import {
  UserInfoRequest,
  UserInfoResponse,
  UserServiceController,
} from '@cogna-edu/contracts/gen/auth/user';
import { UserService } from './user.service';

@GrpcService()
@UserServiceControllerMethods()
export class UserController implements UserServiceController {
  constructor(private readonly userService: UserService) {}

  public async getUserInfo(
    request: UserInfoRequest,
  ): Promise<UserInfoResponse> {
    return this.userService.getUserInfo(request);
  }
}
