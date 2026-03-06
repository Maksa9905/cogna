import { Field, ObjectType } from '@nestjs/graphql';
import { SuccessResponse } from '@cogna-edu/contracts/gen/content/common';

@ObjectType()
export class SuccessResponseContentGql implements SuccessResponse {
  @Field()
  ok: boolean;
}
