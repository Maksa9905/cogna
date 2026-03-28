import { SuccessResponse } from '@cogna-edu/contracts/gen/auth/auth';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SuccessResponseGql implements SuccessResponse {
  @Field()
  ok: boolean;
}
