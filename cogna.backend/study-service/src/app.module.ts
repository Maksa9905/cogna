import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InfraModule } from './infra/infra.module';
import { TicketAttemptModule } from './modules/ticket-attempt/ticket-attempt.module';
import { SubjectProgressModule } from './modules/subject-progress/subject-progress.module';
import { TicketProgressModule } from './modules/ticket-progress/ticket-progress.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    InfraModule,
    TicketAttemptModule,
    SubjectProgressModule,
    TicketProgressModule,
  ],
})
export class AppModule {}
