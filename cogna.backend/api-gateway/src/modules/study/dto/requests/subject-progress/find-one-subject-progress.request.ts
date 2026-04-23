import { FindOneSubjectProgressRequest } from '@cogna-edu/contracts/gen/study/subject-progress';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FindOneSubjectProgressRequestGql implements Omit<
  FindOneSubjectProgressRequest,
  'userId'
> {
  @Field()
  subjectId: string;
}
