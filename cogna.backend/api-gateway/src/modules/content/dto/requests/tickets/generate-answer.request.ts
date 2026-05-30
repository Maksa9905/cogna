import { Field, InputType } from '@nestjs/graphql';
import { GenerateAnswerRequest } from '@cogna-edu/contracts/gen/content/ticket';

@InputType()
export class GenerateAnswerRequestGql implements GenerateAnswerRequest {
  @Field()
  question: string;
}
