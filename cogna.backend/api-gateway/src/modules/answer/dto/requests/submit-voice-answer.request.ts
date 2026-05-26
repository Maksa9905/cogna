import { Field, InputType } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';

@InputType()
export class SubmitVoiceAnswerRequestGql {
  @Field(() => [GraphQLUpload])
  audioContent: Promise<FileUpload>[];

  @Field()
  attemptId: string;

  @Field()
  ticketId: string;

  @Field()
  chunkIndex: number;

  @Field()
  isLast: boolean;
}
