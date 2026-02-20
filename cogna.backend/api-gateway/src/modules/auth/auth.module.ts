import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../../common/strategies';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'AUTH_GRPC',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'auth.v1',
            protoPath:
              './node_modules/@cogna-edu/contracts/proto/auth/auth.proto',
            url: config.getOrThrow<string>('AUTH_GRPC_URL', 'localhost:50051'),
          },
        }),
      },
    ]),
  ],
  providers: [AuthResolver, AuthService, JwtStrategy],
})
export class AuthModule {}
