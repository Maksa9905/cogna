import { Field, InputType } from '@nestjs/graphql';
import { CreateSubjectRequest } from '@cogna-edu/contracts/gen/content/subject';

@InputType()
export class CreateSubjectRequestGql implements Omit<
  CreateSubjectRequest,
  'userId'
> {
  @Field()
  title: string;
}
