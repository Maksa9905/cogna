import { TranscriptionRequest } from '@cogna-edu/contracts/dist/transcription/transcription';
import { Field, InputType } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';

@InputType()
export class AppendAnswerChunkRequestGql implements Omit<
  TranscriptionRequest,
  'audioContent' | 'userId'
> {
  @Field(() => GraphQLUpload)
  audioContent: FileUpload;

  @Field()
  attemptId: string;

  @Field()
  ticketId: string;

  @Field()
  chunkIndex: number;

  @Field()
  isLast: boolean;
}
