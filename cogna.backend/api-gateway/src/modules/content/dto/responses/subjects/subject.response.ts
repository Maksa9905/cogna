import { Field, ObjectType } from '@nestjs/graphql';
import {
  FindAllSubjectsResponse,
  SubjectResponse,
} from '@cogna-edu/contracts/gen/content/subject';
import { SubjectGql } from '../../entities';
import { SubjectProgressGql } from '../../../../study/dto';

@ObjectType()
export class SubjectResponseGql implements SubjectResponse {
  @Field(() => SubjectGql)
  subject: SubjectGql;

  @Field(() => SubjectProgressGql, { nullable: true })
  subjectProgress: SubjectProgressGql | undefined;
}

@ObjectType()
export class FindAllSubjectsResponseGql implements FindAllSubjectsResponse {
  @Field(() => [SubjectGql])
  subjects: SubjectGql[];

  @Field()
  totalCount: number;
}
