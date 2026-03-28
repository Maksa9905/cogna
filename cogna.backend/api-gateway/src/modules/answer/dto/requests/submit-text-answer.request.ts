import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SubmitTextAnswerRequestGql {
  @Field()
  answer: string;

  @Field()
  ticketId: string;
}
