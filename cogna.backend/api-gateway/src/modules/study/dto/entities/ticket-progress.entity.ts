import { Field, ObjectType } from '@nestjs/graphql';
import { TicketProgress } from '@cogna-edu/contracts/gen/study/ticket-progress';
import { TicketAttemptEntity } from './ticket-attempt.entity';

@ObjectType()
export class TicketProgressEntity implements Omit<TicketProgress, 'userId'> {
  @Field()
  id: string;

  @Field()
  subjectId: string;

  @Field()
  ticketId: string;

  @Field()
  averageScore: number;

  @Field()
  bestScore: number;

  @Field()
  lastScore: number;

  @Field()
  totalCount: number;

  @Field(() => [TicketAttemptEntity])
  ticketsAttempts: TicketAttemptEntity[];

  @Field()
  updatedAt: Date;

  @Field()
  createdAt: Date;
}
