import { Field, InputType } from '@nestjs/graphql';
import { DeleteTicketRequest } from '@cogna-edu/contracts/gen/content/ticket';

@InputType()
export class DeleteTicketRequestGql implements Omit<
  DeleteTicketRequest,
  'userId'
> {
  @Field()
  id: string;
}
