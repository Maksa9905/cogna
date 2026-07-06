import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { AnswerOption, Quiz } from '@cogna-edu/contracts/gen/content/quiz';
import {
  AnswerOptionInput,
  QuestionType,
} from '@cogna-edu/contracts/dist/shared/quiz';

registerEnumType(QuestionType, {
  name: 'QuestionType',
});

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
  subjectId: string;

  @Field({ nullable: true })
  ticketId?: string;

  @Field(() => QuestionType)
  type: QuestionType;

  @Field()
  question: string;

  @Field({ nullable: true })
  referenceAnswer?: string;

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
