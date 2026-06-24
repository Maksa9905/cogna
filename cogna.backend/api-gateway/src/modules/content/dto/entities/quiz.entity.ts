import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  AnswerOption,
  AnswerOptionInput,
  Quiz,
} from '@cogna-edu/contracts/dist/content/quiz';

@ObjectType()
export class AnswerOptionGql implements AnswerOption {
  @Field()
  id: string;

  @Field()
  isCorrect: boolean;

  @Field()
  text: string;
}

@ObjectType()
export class QuizGql implements Quiz {
  @Field()
  id: string;

  @Field()
  question: string;

  @Field()
  thesisId: string;

  @Field()
  ticketId: string;

  @Field(() => [AnswerOptionGql])
  answerOptions: AnswerOptionGql[];

  @Field(() => Date)
  updatedAt: Date | undefined;

  @Field(() => Date)
  createdAt: Date | undefined;
}

@InputType()
export class AnswerOptionInputGql implements AnswerOptionInput {
  @Field()
  text: string;

  @Field()
  isCorrect: boolean;

  @Field({ nullable: true })
  id?: string;
}
