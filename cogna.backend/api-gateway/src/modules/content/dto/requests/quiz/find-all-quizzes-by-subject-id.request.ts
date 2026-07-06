import { Field, InputType } from '@nestjs/graphql';
import { FindAllQuizzesBySubjectIdRequest } from '@cogna-edu/contracts/gen/content/quiz';

@InputType()
export class FindAllQuizzesBySubjectIdRequestGql
  implements FindAllQuizzesBySubjectIdRequest
{
  @Field()
  subjectId: string;

  @Field({ nullable: true })
  ticketId?: string;
}
