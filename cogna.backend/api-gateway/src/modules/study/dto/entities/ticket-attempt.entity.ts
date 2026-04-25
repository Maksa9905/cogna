import { Field, ObjectType } from '@nestjs/graphql';
import { ThesisAssessmentGql } from '../../../../common/graphql/thesis-assessment.gql';
import { TicketAttempt } from '@cogna-edu/contracts/gen/study/ticket-attempt';

@ObjectType()
export class TicketAttemptEntity implements Omit<TicketAttempt, 'userId'> {
  @Field()
  id: string;
  @Field()
  ticketProgressId: string;
  @Field()
  score: number;
  @Field()
  subjectId: string;
  @Field()
  summary: string;
  @Field(() => [ThesisAssessmentGql])
  theses: ThesisAssessmentGql[];
  @Field()
  ticketId: string;
  @Field()
  updatedAt: Date;
  @Field()
  createdAt: Date;
}
