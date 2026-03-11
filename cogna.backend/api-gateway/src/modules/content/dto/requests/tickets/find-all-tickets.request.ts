import { Field, InputType, Int } from '@nestjs/graphql';
import { FindAllTicketsRequest } from '@cogna-edu/contracts/gen/content/ticket';

@InputType()
export class FindAllTicketsRequestGql implements FindAllTicketsRequest {
  @Field()
  subjectId: string;
  @Field(() => Int, { nullable: true, defaultValue: 10 })
  limit: number;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  offset: number;
}
