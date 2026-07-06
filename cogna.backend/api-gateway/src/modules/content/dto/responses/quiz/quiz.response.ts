import { Field, ObjectType } from '@nestjs/graphql';
import {
  CreateQuizResponse,
  GenerateQuizResponse,
  QuizResponse,
} from '@cogna-edu/contracts/gen/content/quiz';
import { QuizGql } from '../../entities';

@ObjectType()
export class QuizResponseGql implements QuizResponse {
  @Field(() => QuizGql, { nullable: true })
  quiz: QuizGql | undefined;
}

@ObjectType()
export class CreateQuizResponseGql implements CreateQuizResponse {
  @Field(() => QuizGql, { nullable: true })
  quiz: QuizGql | undefined;
}

@ObjectType()
export class GenerateQuizResponseGql implements GenerateQuizResponse {
  @Field(() => [QuizGql])
  quizzes: QuizGql[];
}

@ObjectType()
export class FindAllQuizzesBySubjectIdResponseGql {
  @Field(() => [QuizGql])
  quizzes: QuizGql[];

  @Field()
  totalCount: number;
}
