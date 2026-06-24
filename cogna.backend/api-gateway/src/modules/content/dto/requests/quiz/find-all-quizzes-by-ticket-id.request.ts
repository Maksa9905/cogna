import { Field, InputType } from '@nestjs/graphql';
import { FindAllQuizzesByTicketIdRequest } from '@cogna-edu/contracts/dist/content/quiz';

@InputType()
export class FindAllQuizzesByTicketIdRequestGql
  implements FindAllQuizzesByTicketIdRequest
{
  @Field()
  ticketId: string;
}
