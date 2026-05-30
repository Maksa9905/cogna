import { Module } from '@nestjs/common';
import { ThesisService } from './thesis.service';
import { ThesisController } from './thesis.controller';

@Module({
  controllers: [ThesisController],
  providers: [ThesisService],
})
export class ThesisModule {}
