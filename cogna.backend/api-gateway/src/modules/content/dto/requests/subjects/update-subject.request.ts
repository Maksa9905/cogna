import { Field, InputType } from '@nestjs/graphql';
import { UpdateSubjectRequest } from '@cogna-edu/contracts/gen/content/subject';

@InputType()
export class UpdateSubjectRequestGql implements Omit<
  UpdateSubjectRequest,
  'userId'
> {
  @Field()
  id: string;

  @Field()
  title: string;
}
