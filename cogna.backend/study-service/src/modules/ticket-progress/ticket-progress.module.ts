import { Module } from '@nestjs/common';
import { TicketProgressService } from './ticket-progress.service';
import { TicketProgressController } from './ticket-progress.controller';
import { TicketProgressRepository } from './ticket-progress.repository';

@Module({
  controllers: [TicketProgressController],
  providers: [TicketProgressService, TicketProgressRepository],
})
export class TicketProgressModule {}
