import { Module } from '@nestjs/common';
import { GroqChatCompletionService } from './groq-chat-completion.service';

@Module({
  providers: [GroqChatCompletionService],
  exports: [GroqChatCompletionService]
})
export class GroqChatCompletionModule {}
