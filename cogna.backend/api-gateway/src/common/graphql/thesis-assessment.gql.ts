import { Field, ObjectType } from '@nestjs/graphql';
import type { ThesisAssessment } from '@cogna-edu/contracts/gen/study/ticket-attempt';

@ObjectType()
export class ThesisAssessmentGql implements ThesisAssessment {
  @Field(() => String)
  thesis: string;

  @Field(() => String)
  assessment: string;
}
