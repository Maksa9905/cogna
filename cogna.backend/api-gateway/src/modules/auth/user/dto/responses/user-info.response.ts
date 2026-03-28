import { UserInfoResponse } from '@cogna-edu/contracts/gen/auth/user';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserInfoResponseGql implements UserInfoResponse {
  @Field()
  userId: string;

  @Field()
  email: string;
}
