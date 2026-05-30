import { Field, ObjectType } from '@nestjs/graphql';
import { GenerateAnswerResponse } from '@cogna-edu/contracts/gen/content/ticket';

@ObjectType()
export class GenerateAnswerResponseGql implements GenerateAnswerResponse {
  @Field()
  answer: string;
}
