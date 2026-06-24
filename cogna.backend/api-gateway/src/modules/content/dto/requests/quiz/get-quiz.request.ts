import { Field, InputType } from '@nestjs/graphql';
import { GetQuizRequest } from '@cogna-edu/contracts/dist/content/quiz';

@InputType()
export class GetQuizRequestGql implements GetQuizRequest {
  @Field()
  id: string;
}
