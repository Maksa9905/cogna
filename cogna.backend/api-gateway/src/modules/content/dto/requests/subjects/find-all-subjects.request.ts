import { FindAllSubjectRequest } from '@cogna-edu/contracts/gen/content/subject';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FindAllSubjectsRequestGql implements Omit<
  FindAllSubjectRequest,
  'userId'
> {
  @Field(() => Int, { nullable: true, defaultValue: 10 })
  limit: number;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  offset: number;
}
