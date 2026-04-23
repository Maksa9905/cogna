import {
  FindAllSubjectProgressResponse,
  FindOneSubjectProgressResponse,
  SubjectProgress,
} from '@cogna-edu/contracts/gen/study/subject-progress';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { TicketProgressGql } from '../ticket-progress';

@ObjectType()
export class SubjectProgressGql implements SubjectProgress {
  @Field()
  id: string;

  @Field()
  subjectId: string;

  @Field()
  userId: string;

  @Field(() => Int)
  studiedTickets: number;

  @Field(() => Float)
  averageTicketsScore: number;

  @Field(() => Date, { nullable: true })
  lastRepetitionData: Date | undefined;

  @Field(() => [TicketProgressGql])
  ticketsProgress: TicketProgressGql[];

  @Field(() => Date, { nullable: true })
  createdAt: Date | undefined;

  @Field(() => Date, { nullable: true })
  updatedAt: Date | undefined;
}

@ObjectType()
export class FindOneSubjectProgressResponseGql implements FindOneSubjectProgressResponse {
  @Field(() => SubjectProgressGql, { nullable: true })
  subjectProgress: SubjectProgressGql | undefined;
}

@ObjectType()
export class FindAllSubjectProgressResponseGql implements FindAllSubjectProgressResponse {
  @Field(() => [SubjectProgressGql])
  subjectsProgress: SubjectProgressGql[];
}
