import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { MetadataInterceptor } from '../../common/interseptors/metadata.interceptor';
import { getQuizGenerationClientConfig } from './clients/quiz-generation.grpc.client';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'QUIZ_GENERATION_CLIENT',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: getQuizGenerationClientConfig,
      },
    ]),
  ],
  controllers: [QuizController],
  providers: [QuizService, MetadataInterceptor],
})
export class QuizModule {}
