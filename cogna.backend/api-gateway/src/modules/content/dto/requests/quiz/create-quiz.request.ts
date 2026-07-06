import { Field, InputType } from '@nestjs/graphql';
import { CreateQuizRequest } from '@cogna-edu/contracts/gen/content/quiz';
import { QuestionType } from '@cogna-edu/contracts/dist/shared/quiz';
import { AnswerOptionInputGql } from '../../entities';

@InputType()
export class CreateQuizRequestGql implements CreateQuizRequest {
  @Field()
  subjectId: string;

  @Field()
  ticketId: string;

  @Field(() => QuestionType)
  type: QuestionType;

  @Field()
  question: string;

  @Field({ nullable: true })
  referenceAnswer?: string;

  @Field(() => [AnswerOptionInputGql], { defaultValue: [] })
  answerOptions: AnswerOptionInputGql[];
}
