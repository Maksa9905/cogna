import { Field, ObjectType } from '@nestjs/graphql';
import {
  FindAllSubjectsResponse,
  SubjectResponse,
} from '@cogna-edu/contracts/gen/content/subject';
import { SubjectGql } from '../../entities/subject.entity';

@ObjectType()
export class SubjectResponseGql implements SubjectResponse {
  @Field(() => SubjectGql, { nullable: true })
  subject: SubjectGql | undefined;
}

@ObjectType()
export class FindAllSubjectsResponseGql implements FindAllSubjectsResponse {
  @Field(() => [SubjectGql])
  subjects: SubjectGql[];

  @Field()
  totalCount: number;
}
