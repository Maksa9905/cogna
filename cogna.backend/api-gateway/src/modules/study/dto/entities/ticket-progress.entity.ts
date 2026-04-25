import { TicketProgress } from '@cogna-edu/contracts/gen/study/ticket-progress';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { TicketAttemptGql } from './ticket-attempt.entity';

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

  @Field(() => [TicketAttemptGql])
  ticketAttempts: TicketAttemptGql[];

  @Field(() => Date, { nullable: true })
  createdAt: Date | undefined;

  @Field(() => Date, { nullable: true })
  updatedAt: Date | undefined;
}
