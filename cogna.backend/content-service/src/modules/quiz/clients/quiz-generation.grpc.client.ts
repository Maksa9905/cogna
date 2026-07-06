import { ConfigService } from '@nestjs/config';
import { GrpcOptions, Transport } from '@nestjs/microservices';

export const getQuizGenerationClientConfig = (
  config: ConfigService,
): GrpcOptions => {
  const rootProtoDir = 'node_modules/@cogna-edu/contracts/proto';

  return {
    transport: Transport.GRPC,
    options: {
      package: ['internal.ai.quiz.v1', 'shared.quiz.v1'],
      url: config.getOrThrow<string>('AI_GRPC_URL', 'localhost:50053'),
      protoPath: [
        'internal/ai/quiz_generation.proto',
        'shared/quiz.proto',
      ],
      loader: {
        includeDirs: [rootProtoDir],
      },
    },
  };
};
