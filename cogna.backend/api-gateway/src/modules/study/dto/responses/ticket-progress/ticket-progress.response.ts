import {
  FindAllTicketsProgressResponse,
  FindOneTicketProgressResponse,
} from '@cogna-edu/contracts/gen/study/ticket-progress';
import { Field, ObjectType } from '@nestjs/graphql';
import { TicketProgressGql } from '../../entities';

@ObjectType()
export class FindOneTicketProgressResponseGql implements FindOneTicketProgressResponse {
  @Field(() => TicketProgressGql, { nullable: true })
  ticketProgress: TicketProgressGql | undefined;
}

@ObjectType()
export class FindAllTicketsProgressResponseGql implements FindAllTicketsProgressResponse {
  @Field(() => [TicketProgressGql])
  ticketsProgress: TicketProgressGql[];
}
