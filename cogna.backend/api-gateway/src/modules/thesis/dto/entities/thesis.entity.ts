import { Field, ObjectType } from '@nestjs/graphql';
import { Thesis } from '@cogna-edu/contracts/gen/thesis/thesis';

@ObjectType()
export class ThesisEntity implements Thesis {
  @Field()
  value: string;

  @Field()
  importance: string;
}
