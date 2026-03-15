import {TranscriptionRequest} from "@cogna-edu/contracts/dist/transcription/transcription";
import {Field, InputType} from "@nestjs/graphql";
import {FileUpload, GraphQLUpload} from "graphql-upload-ts";

@InputType()
export class AppendAnswerChunkRequestGql implements Omit<TranscriptionRequest, 'audioContent'> {
    @Field(() => GraphQLUpload)
    audioContent: FileUpload

    @Field()
    attemptId: string;

    @Field()
    chunkIndex: number;

    @Field()
    isLast: boolean;
}