import { Field, ObjectType } from '@nestjs/graphql';
import { Ticket } from '@cogna-edu/contracts/gen/content/ticket';
import { ThesisGql } from './thesis.entity';

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

  @Field(() => [ThesisGql])
  theses: ThesisGql[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
