import { Field, InputType } from '@nestjs/graphql';
import { CreateQuizRequest } from '@cogna-edu/contracts/dist/content/quiz';

@InputType()
export class CreateQuizRequestGql implements CreateQuizRequest {
  @Field()
  ticketId: string;

  @Field(() => [String])
  thesisIds: string[];
}
