import { Field, InputType } from '@nestjs/graphql';
import { DeleteQuizRequest } from '@cogna-edu/contracts/dist/content/quiz';

@InputType()
export class DeleteQuizRequestGql implements DeleteQuizRequest {
  @Field()
  id: string;
}
