import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infra/prisma/prisma.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { SubjectModule } from './modules/subject/subject.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    SubjectModule,
    TicketModule,
  ],
})
export class AppModule {}
