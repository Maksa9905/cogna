import {
  ThesisAssessment,
  TicketAttempt,
} from '@cogna-edu/contracts/gen/study/ticket-attempt';
import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ThesisAssessmentGql implements ThesisAssessment {
  @Field()
  thesis: string;

  @Field()
  assessment: string;
}

@ObjectType()
export class TicketAttemptGql implements TicketAttempt {
  @Field()
  id: string;

  @Field()
  ticketProgressId: string;

  @Field(() => Float)
  score: number;

  @Field()
  summary: string;

  @Field(() => [ThesisAssessmentGql])
  theses: ThesisAssessmentGql[];

  @Field(() => Date, { nullable: true })
  createdAt: Date | undefined;

  @Field(() => Date, { nullable: true })
  updatedAt: Date | undefined;
}
