import { Field, InputType } from '@nestjs/graphql';
import { FindAllTicketsRequest } from '@cogna-edu/contracts/gen/content/ticket';

@InputType()
export class FindAllTicketsRequestGql implements FindAllTicketsRequest {
  @Field()
  subjectId: string;
}
