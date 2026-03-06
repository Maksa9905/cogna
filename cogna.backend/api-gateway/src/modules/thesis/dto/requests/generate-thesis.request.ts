import { Field, InputType } from '@nestjs/graphql';
import { GenerateThesesRequest } from '@cogna-edu/contracts/gen/thesis/thesis';

@InputType()
export class GenerateThesisRequestGql implements GenerateThesesRequest {
  @Field()
  answer: string;

  @Field()
  question: string;
}
