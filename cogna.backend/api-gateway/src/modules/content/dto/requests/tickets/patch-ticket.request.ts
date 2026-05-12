import { Field, InputType } from '@nestjs/graphql';
import { PatchTicketRequest } from '@cogna-edu/contracts/gen/content/ticket';
import { ThesisInputGql } from '../../entities';

@InputType()
export class PatchTicketRequestGql implements Omit<
  PatchTicketRequest,
  'userId' | 'theses'
> {
  @Field()
  id: string;

  @Field({ nullable: true })
  question?: string;

  @Field({ nullable: true })
  answer?: string;

  @Field(() => [ThesisInputGql], { nullable: true, defaultValue: [] })
  theses?: ThesisInputGql[];
}
