import {
  FindAllTicketsProgressResponse,
  FindOneTicketProgressResponse,
  TicketProgress,
} from '@cogna-edu/contracts/gen/study/ticket-progress';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TicketProgressGql implements TicketProgress {
  @Field()
  id: string;

  @Field()
  ticketId: string;

  @Field()
  userId: string;

  @Field()
  subjectId: string;

  @Field(() => Int)
  totalCount: number;

  @Field(() => Float)
  bestScore: number;

  @Field(() => Float)
  lastScore: number;

  @Field(() => Float)
  averageScore: number;

  @Field(() => Date, { nullable: true })
  createdAt: Date | undefined;

  @Field(() => Date, { nullable: true })
  updatedAt: Date | undefined;
}

@ObjectType()
export class FindOneTicketProgressResponseGql implements FindOneTicketProgressResponse {
  @Field(() => TicketProgressGql, { nullable: true })
  ticketProgress: TicketProgressGql | undefined;
}

@ObjectType()
export class FindAllTicketsProgressResponseGql implements FindAllTicketsProgressResponse {
  @Field(() => [TicketProgressGql])
  ticketsProgress: TicketProgressGql[];
}
