import { FindAllSubjectProgressRequest } from '@cogna-edu/contracts/gen/study/subject-progress';
import { Field, InputType } from '@nestjs/graphql';

/**
 * В proto только userId; для GQL userId из контекста.
 * GraphQL Input требует ≥1 поля — служебное, в gRPC не передаётся.
 */
@InputType()
export class FindAllSubjectsProgressRequestGql implements Omit<
  FindAllSubjectProgressRequest,
  'userId'
> {
  @Field(() => Boolean, {
    nullable: true,
    defaultValue: true,
    description: 'Не используется',
  })
  _unused?: boolean;
}
