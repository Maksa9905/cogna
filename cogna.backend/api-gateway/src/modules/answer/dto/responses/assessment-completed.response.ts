import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ThesisAssessmentGql } from '../../../../common/graphql/thesis-assessment.gql';
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
