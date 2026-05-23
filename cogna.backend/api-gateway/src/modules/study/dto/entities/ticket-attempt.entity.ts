import {
  ThesisAssessment,
  TicketAttempt,
} from '@cogna-edu/contracts/gen/study/ticket-attempt';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

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

  @Field(() => Int)
  rating: number;

  @Field(() => Int)
  state: number;

  @Field(() => Date, { nullable: true })
  due: Date | undefined;

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

  @Field(() => Float)
  stability: number;

  @Field(() => Float)
  difficulty: number;

  @Field(() => Int)
  elapsedDays: number;

  @Field(() => Int)
  lastElapsedDays: number;

  @Field(() => Int)
  scheduledDays: number;

  @Field(() => Int)
  learningSteps: number;

  @Field(() => Date, { nullable: true })
  review: Date | undefined;
}
