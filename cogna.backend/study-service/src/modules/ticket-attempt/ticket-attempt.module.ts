import { Module } from '@nestjs/common';
import { TicketAttemptService } from './ticket-attempt.service';
import { TicketAttemptController } from './ticket-attempt.controller';
import { TicketAttemptRepository } from './ticket-attempt.repository';
import { TicketProgressRepository } from './ticket-progress.repository';
import { SubjectProgressModule } from '../subject-progress/subject-progress.module';

@Module({
  imports: [SubjectProgressModule],
  controllers: [TicketAttemptController],
  providers: [TicketAttemptService, TicketAttemptRepository, TicketProgressRepository],
})
export class TicketAttemptModule {}
