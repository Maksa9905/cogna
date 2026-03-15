import {Args, Mutation, Resolver} from '@nestjs/graphql';
import {TranscriptionService} from './transcription.service';
import {AppendAnswerChunkRequestGql} from "./dto/requests/append-answer-chunk.request";
import {ReplaySubject} from "rxjs";
import {TranscriptionRequest} from "@cogna-edu/contracts/dist/transcription/transcription";

@Resolver()
export class TranscriptionResolver {
    constructor(private readonly transcriptionService: TranscriptionService) {
    }

    @Mutation(() => Boolean)
    public async appendAnswerChunk(@Args('data') dto: AppendAnswerChunkRequestGql) {
        const {audioContent, attemptId, chunkIndex, isLast} = dto
        const file = await audioContent;
        const { createReadStream } = file;
        const readStream = createReadStream();

        const stream = new ReplaySubject<TranscriptionRequest>()
        // console.log(audioContent)
        this.transcriptionService.createTranscriptionChunk(stream).subscribe({
            next: (res) => {
                console.log('текст получен', res)
            },
            error: (err) => console.error('Ошибка транскрибации:', err)
        })
        readStream.on('data', (chunk: Buffer) => {
            stream.next({
                audioContent: chunk,
                attemptId,
                chunkIndex,
                isLast
            })
        })
        return new Promise((resolve) => {
            readStream.on('end', () => {
                stream.complete(); // Закрываем gRPC стрим
                resolve(true);
            });
        });
    }
}
