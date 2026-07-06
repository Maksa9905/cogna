import { Field, InputType } from '@nestjs/graphql';
import { PatchQuizRequest } from '@cogna-edu/contracts/gen/content/quiz';
import { AnswerOptionInputGql } from '../../entities';

@InputType()
export class PatchQuizRequestGql
  implements Omit<PatchQuizRequest, 'answerOptions'>
{
  @Field()
  id: string;

  @Field({ nullable: true })
  question?: string;

  @Field({ nullable: true })
  referenceAnswer?: string;

  @Field(() => [AnswerOptionInputGql], { nullable: true, defaultValue: [] })
  answerOptions?: AnswerOptionInputGql[];
}
