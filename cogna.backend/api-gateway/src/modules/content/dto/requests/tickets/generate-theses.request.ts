import { Field, InputType } from '@nestjs/graphql';
import { GenerateThesesRequest } from '@cogna-edu/contracts/gen/content/ticket';

@InputType()
export class GenerateThesesRequestGql implements GenerateThesesRequest {
  @Field()
  ticketId: string;

  @Field()
  answer: string;

  @Field()
  question: string;
}
