import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { InfraModule } from './infra/infra.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    InfraModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
