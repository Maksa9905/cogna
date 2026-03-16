import { Module } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { AssessmentController } from './assessment.controller';
import { ClientsModule, GrpcOptions, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GroqChatCompletionService } from '../groq-chat-completion/groq-chat-completion.service';

@Module({
  imports: [ClientsModule.registerAsync([
    {
      name: 'CONTENT_GRPC_CLIENT',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): GrpcOptions => ({
        transport: Transport.GRPC,
        options: {
          package: ['ticket.v1'],
          url: config.getOrThrow<string>('CONTENT_GRPC_URL', 'localhost:50052'),
          protoPath: ['node_modules/@cogna-edu/contracts/proto/content/ticket.proto'],
          loader: {
            includeDirs: ['node_modules/@cogna-edu/contracts/proto']
          }
        },
      }),
    },
  ])],
  controllers: [AssessmentController],
  providers: [AssessmentService, GroqChatCompletionService],
})
export class AssessmentModule {
}
