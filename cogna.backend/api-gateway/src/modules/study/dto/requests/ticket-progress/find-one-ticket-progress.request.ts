import { FindOneTicketProgressRequest } from '@cogna-edu/contracts/gen/study/ticket-progress';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FindOneTicketProgressRequestGql implements Omit<
  FindOneTicketProgressRequest,
  'userId'
> {
  @Field()
  ticketId: string;

  @Field()
  subjectId: string;
}
