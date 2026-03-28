import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SubmitAnswerResponseGql {
  @Field(() => Boolean)
  success: boolean;
}
