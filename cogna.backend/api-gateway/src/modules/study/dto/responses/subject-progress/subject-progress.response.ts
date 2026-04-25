import {
  FindAllSubjectProgressResponse,
  FindOneSubjectProgressResponse,
} from '@cogna-edu/contracts/gen/study/subject-progress';
import { Field, ObjectType } from '@nestjs/graphql';
import { SubjectProgressGql } from '../../entities';

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
