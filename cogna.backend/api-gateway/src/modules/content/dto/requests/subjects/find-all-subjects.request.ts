import { FindAllSubjectRequest } from '@cogna-edu/contracts/gen/content/subject';
import { InputType } from '@nestjs/graphql';

@InputType()
export class FindAllSubjectsRequestGql implements Omit<
  FindAllSubjectRequest,
  'userId'
> {}
