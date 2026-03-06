import { Field, InputType } from '@nestjs/graphql';
import { UpdateTicketRequest } from '@cogna-edu/contracts/gen/content/ticket';
import { ThesisInputGql } from '../../entities';

@InputType()
export class UpdateTicketRequestGql implements Omit<
  UpdateTicketRequest,
  'userId'
> {
  @Field()
  id: string;

  @Field({ nullable: true })
  question?: string;

  @Field({ nullable: true })
  answer: string;

  @Field(() => [ThesisInputGql], { nullable: true, defaultValue: [] })
  theses: ThesisInputGql[];
}
