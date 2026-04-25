import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ThesisAssessmentGql } from '../../../study/dto/entities/ticket-attempt.entity';
import { AssessmentCompletedResponse } from '@cogna-edu/contracts/gen/assessment/assessment';

@ObjectType()
export class AssessmentCompletedResponseGql implements AssessmentCompletedResponse {
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
