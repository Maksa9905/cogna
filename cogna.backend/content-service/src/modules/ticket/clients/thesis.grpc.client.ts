import { ConfigService } from '@nestjs/config';
import { GrpcOptions, Transport } from '@nestjs/microservices';

export const getThesisClientConfig = (config: ConfigService): GrpcOptions => {
  return {
    transport: Transport.GRPC,
    options: {
      package: 'thesis.v1',
      url: config.getOrThrow<string>('THESES_GRPC_URL', 'localhost:50053'),
      protoPath: [
        'node_modules/@cogna-edu/contracts/proto/thesis/thesis.proto',
      ],
    },
  };
};
