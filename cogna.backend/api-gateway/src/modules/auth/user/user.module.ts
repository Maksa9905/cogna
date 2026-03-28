import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { ClientsModule, GrpcOptions, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'USER_GRPC',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService): GrpcOptions => ({
          transport: Transport.GRPC,
          options: {
            package: 'user.v1',
            protoPath:
              './node_modules/@cogna-edu/contracts/proto/auth/user.proto',
            url: config.getOrThrow<string>('AUTH_GRPC_URL', 'localhost:50051'),
          },
        }),
      },
    ]),
  ],
  providers: [UserResolver, UserService],
})
export class UserModule {}
