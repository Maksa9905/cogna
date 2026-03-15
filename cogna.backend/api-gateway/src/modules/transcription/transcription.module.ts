import { Module } from '@nestjs/common';
import { TranscriptionService } from './transcription.service';
import { TranscriptionResolver } from './transcription.resolver';
import { GraphQLUpload } from 'graphql-upload-ts';
import { ClientsModule, GrpcOptions, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'TRANSCRIPTION_CLIENT',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService): GrpcOptions => ({
          transport: Transport.GRPC,
          options: {
            package: 'transcription.v1',
            url: config.getOrThrow<string>(
              'TRANSCRIPTION_GRPC_URL',
              'localhost:50054',
            ),
            protoPath: [
              './node_modules/@cogna-edu/contracts/proto/transcription/transcription.proto',
            ],
          },
        }),
      },
    ]),
  ],
  providers: [
    TranscriptionResolver,
    TranscriptionService,
    {
      provide: 'GraphQLUpload',
      useValue: GraphQLUpload,
    },
  ],
})
export class TranscriptionModule {}
