import { Field, InputType, Int } from '@nestjs/graphql';
import { FindDueTicketsProgressRequest } from '@cogna-edu/contracts/gen/study/ticket-progress';

@InputType()
export class FindDueTicketsProgressRequestGql implements Omit<
  FindDueTicketsProgressRequest,
  'userId'
> {
  @Field()
  subjectId: string;

  @Field(() => Int, { nullable: true })
  limit?: number | undefined;

  @Field(() => Int, { nullable: true })
  offset?: number | undefined;
}
