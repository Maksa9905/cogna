import { FindAllTicketsProgressRequest } from '@cogna-edu/contracts/gen/study/ticket-progress';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FindAllTicketsProgressRequestGql implements Omit<
  FindAllTicketsProgressRequest,
  'userId'
> {
  @Field()
  subjectId: string;
}
