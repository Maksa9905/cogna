import { Module } from '@nestjs/common';
import { ThesisModule } from './modules/thesis/thesis.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThesisModule,
  ],
})
export class AppModule {}
