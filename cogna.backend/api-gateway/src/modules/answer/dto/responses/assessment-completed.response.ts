import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ThesisAssessmentGql } from '../../../study/dto/entities/ticket-attempt.entity';
import { AssessmentCompletedEvent } from '@cogna-edu/contracts/gen/events/assessment/assessment';

@ObjectType()
export class AssessmentCompletedResponseGql implements AssessmentCompletedEvent {
  @Field(() => String)
  ticketId: string;

  @Field(() => String)
  userId: string;

  @Field(() => String)
  subjectId: string;

  @Field(() => Int)
  score: number;

  @Field(() => [ThesisAssessmentGql])
  theses: ThesisAssessmentGql[];

  @Field(() => String)
  summary: string;
}
