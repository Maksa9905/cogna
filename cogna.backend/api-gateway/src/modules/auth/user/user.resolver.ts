import { Context, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserInfoResponse } from '@cogna-edu/contracts/gen/auth/user';
import { UserInfoResponseGql } from './dto/responses';
import { Protected } from '../../../common/decorators/protected.decorator';
import { UserRole } from '@cogna-edu/corn/dist/enum/user-role.enum';
import { Request } from 'express';

@Protected(UserRole.USER)
@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserInfoResponseGql)
  userInfo(@Context('req') req: Request): Promise<UserInfoResponse> {
    return this.userService.getUserInfo({ userId: req.user.sub });
  }
}
