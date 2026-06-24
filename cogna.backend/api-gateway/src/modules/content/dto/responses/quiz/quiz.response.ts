import { Field, ObjectType } from '@nestjs/graphql';
import {
  CreateQuizResponse,
  QuizResponse,
} from '@cogna-edu/contracts/dist/content/quiz';
import { QuizGql } from '../../entities';

@ObjectType()
export class QuizResponseGql implements QuizResponse {
  @Field(() => QuizGql, { nullable: true })
  quiz: QuizGql | undefined;
}

@ObjectType()
export class CreateQuizResponseGql implements CreateQuizResponse {
  @Field(() => [QuizGql])
  quizzes: QuizGql[];
}

@ObjectType()
export class FindAllQuizzesByTicketIdResponseGql {
  @Field(() => [QuizGql])
  quizzes: QuizGql[];

  @Field()
  totalCount: number;
}
