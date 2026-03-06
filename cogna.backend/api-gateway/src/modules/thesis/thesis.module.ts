import { Module } from '@nestjs/common';
import { ThesisService } from './thesis.service';
import { ThesisResolver } from './thesis.resolver';
import { ClientsModule, GrpcOptions, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'THESIS_CLIENT',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService): GrpcOptions => ({
          transport: Transport.GRPC,
          options: {
            package: 'thesis.v1',
            url: config.getOrThrow<string>(
              'THESES_GRPC_URL',
              'localhost:50053',
            ),
            protoPath: [
              './node_modules/@cogna-edu/contracts/proto/thesis/thesis.proto',
            ],
          },
        }),
      },
    ]),
  ],
  providers: [ThesisResolver, ThesisService],
})
export class ThesisModule {}
