import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { InfraModule } from './infra/infra.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => ({ ...process.env })],
    }),
    AuthModule,
    InfraModule,
    UserModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
