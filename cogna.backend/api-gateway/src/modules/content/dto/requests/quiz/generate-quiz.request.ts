import { Field, InputType } from '@nestjs/graphql';
import { GenerateQuizRequest } from '@cogna-edu/contracts/gen/content/quiz';
import { QuestionType } from '@cogna-edu/contracts/dist/shared/quiz';

@InputType()
export class GenerateQuizRequestGql implements GenerateQuizRequest {
  @Field()
  subjectId: string;

  @Field()
  ticketId: string;

  @Field(() => QuestionType)
  type: QuestionType;

  @Field({ nullable: true })
  count?: number;
}
