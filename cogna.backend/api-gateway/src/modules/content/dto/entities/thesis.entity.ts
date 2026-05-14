import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Thesis, ThesisInput } from '@cogna-edu/contracts/gen/content/ticket';

@ObjectType()
export class ThesisGql implements Thesis {
  @Field()
  id: string;

  @Field()
  value: string;

  @Field()
  importance: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@InputType()
export class ThesisInputGql implements ThesisInput {
  @Field()
  value: string;

  @Field()
  importance: string;

  @Field({ nullable: true })
  id?: string;
}
