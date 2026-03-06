import { FindOneSubjectRequest } from '@cogna-edu/contracts/gen/content/subject';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FindOneSubjectRequestGql implements Omit<
  FindOneSubjectRequest,
  'userId'
> {
  @Field()
  id: string;
}
