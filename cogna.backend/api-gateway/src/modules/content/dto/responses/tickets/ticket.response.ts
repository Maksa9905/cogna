import { Field, ObjectType } from '@nestjs/graphql';
import {
  FindAllTicketsResponse,
  TicketResponse,
} from '@cogna-edu/contracts/gen/content/ticket';
import { TicketGql } from '../../entities/ticket.entity';

@ObjectType()
export class TicketResponseGql implements TicketResponse {
  @Field(() => TicketGql, { nullable: true })
  ticket: TicketGql | undefined;
}

@ObjectType()
export class FindAllTicketsResponseGql implements FindAllTicketsResponse {
  @Field(() => [TicketGql])
  tickets: TicketGql[];
}
