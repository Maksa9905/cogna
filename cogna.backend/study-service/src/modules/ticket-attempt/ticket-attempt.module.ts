import { Module } from '@nestjs/common';
import { TicketAttemptService } from './ticket-attempt.service';
import { TicketAttemptController } from './ticket-attempt.controller';
import { TicketAttemptRepository } from './ticket-attempt.repository';
import { SubjectProgressModule } from '../subject-progress/subject-progress.module';
import { TicketProgressModule } from '../ticket-progress/ticket-progress.module';

@Module({
  imports: [SubjectProgressModule, TicketProgressModule],
  controllers: [TicketAttemptController],
  providers: [TicketAttemptService, TicketAttemptRepository],
})
export class TicketAttemptModule {}
