import { Field, ObjectType } from '@nestjs/graphql';
import { Ticket } from '@cogna-edu/contracts/gen/content/ticket';
import { ThesisGql } from './thesis.entity';
import { QuizGql } from './quiz.entity';

@ObjectType()
export class TicketGql implements Ticket {
  @Field()
  id: string;

  @Field()
  subjectId: string;

  @Field()
  question: string;

  @Field()
  answer: string;

  @Field(() => [QuizGql])
  quizzes: QuizGql[];

  @Field(() => [ThesisGql])
  theses: ThesisGql[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
