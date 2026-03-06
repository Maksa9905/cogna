import { Field, InputType } from '@nestjs/graphql';
import { CreateTicketRequest } from '@cogna-edu/contracts/gen/content/ticket';
import { ThesisInputGql } from '../../entities';

@InputType()
export class CreateTicketRequestGql implements CreateTicketRequest {
  @Field()
  subjectId: string;

  @Field()
  question: string;

  @Field()
  answer: string;

  @Field(() => [ThesisInputGql], { nullable: true, defaultValue: [] })
  theses: ThesisInputGql[];
}
