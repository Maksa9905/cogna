import { Field, ObjectType } from '@nestjs/graphql';
import { SubjectProgress } from '@cogna-edu/contracts/gen/study/subject-progress';
import { TicketProgressEntity } from './ticket-progress.entity';

@ObjectType()
export class SubjectProgressEntity implements Omit<SubjectProgress, 'userId'> {
  @Field()
  id: string;

  @Field()
  subjectId: string;

  @Field()
  averageTicketsScore: number;

  @Field()
  studiedTickets: number;

  @Field()
  lastRepetitionData: Date;

  @Field(() => [TicketProgressEntity])
  ticketsProgress: TicketProgressEntity[];

  @Field()
  updatedAt: Date;

  @Field()
  createdAt: Date;
}
