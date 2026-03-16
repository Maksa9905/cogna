import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AssessmentModule } from './assessment/assessment.module';
import { GroqChatCompletionModule } from './groq-chat-completion/groq-chat-completion.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }), AssessmentModule, GroqChatCompletionModule],
})
export class AppModule {
}
