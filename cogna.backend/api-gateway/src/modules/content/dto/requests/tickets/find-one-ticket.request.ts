import { Field, InputType } from '@nestjs/graphql';
import { FindOneTicketRequest } from '@cogna-edu/contracts/gen/content/ticket';

@InputType()
export class FindOneTicketRequestGql implements Omit<FindOneTicketRequest, 'userId'> {
  @Field()
  id: string;
}
