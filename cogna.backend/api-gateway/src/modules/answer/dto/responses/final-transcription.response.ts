import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FinalTranscriptionResponseGql {
  @Field(() => String)
  text: string;
}
