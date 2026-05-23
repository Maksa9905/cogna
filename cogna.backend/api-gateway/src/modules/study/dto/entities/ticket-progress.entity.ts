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

  @Field(() => Date, { nullable: true })
  due: Date | undefined;

  @Field(() => Float)
  stability: number;

  @Field(() => Float)
  difficulty: number;

  @Field(() => Int)
  elapsedDays: number;

  @Field(() => Int)
  scheduleDays: number;

  @Field(() => Int)
  learningSteps: number;

  @Field(() => Int)
  reps: number;

  @Field(() => Int)
  lapses: number;

  @Field(() => Int)
  state: number;

  @Field(() => Date, { nullable: true })
  lastReview: Date | undefined;

  @Field(() => [TicketAttemptGql])
  ticketAttempts: TicketAttemptGql[];

  @Field(() => Date, { nullable: true })
  createdAt: Date | undefined;

  @Field(() => Date, { nullable: true })
  updatedAt: Date | undefined;
}
