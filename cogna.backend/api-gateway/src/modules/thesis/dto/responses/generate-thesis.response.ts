import { Field, ObjectType } from '@nestjs/graphql';
import { GenerateThesesResponse } from '@cogna-edu/contracts/gen/thesis/thesis';
import { ThesisEntity } from '../entities/thesis.entity';

@ObjectType()
export class GenerateThesisResponseGql implements GenerateThesesResponse {
  @Field(() => [ThesisEntity])
  theses: ThesisEntity[];
}
