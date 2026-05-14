import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Thesis, ThesisInput } from '@cogna-edu/contracts/gen/content/ticket';

import { Importance } from '@cogna-edu/contracts/dist/content/ticket';

registerEnumType(Importance, { name: 'Importance' });

@ObjectType()
export class ThesisGql implements Thesis {
  @Field()
  id: string;

  @Field()
  value: string;

  @Field(() => Importance)
  importance: Importance;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@InputType()
export class ThesisInputGql implements ThesisInput {
  @Field()
  value: string;

  @Field(() => Importance)
  importance: Importance;

  @Field({ nullable: true })
  id?: string;
}
