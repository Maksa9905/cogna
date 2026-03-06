import { Field, InputType } from '@nestjs/graphql';
import { UserIdRequest } from '@cogna-edu/contracts/gen/content/common';

@InputType()
export class UserIdRequestGql implements UserIdRequest {
  @Field()
  userId: string;
}
