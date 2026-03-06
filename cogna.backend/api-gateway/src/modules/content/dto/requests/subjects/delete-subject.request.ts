import { Field, InputType } from '@nestjs/graphql';
import { DeleteSubjectRequest } from '@cogna-edu/contracts/gen/content/subject';

@InputType()
export class DeleteSubjectRequestGql implements Omit<
  DeleteSubjectRequest,
  'userId'
> {
  @Field()
  id: string;
}
