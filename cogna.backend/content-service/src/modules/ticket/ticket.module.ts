import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getThesisClientConfig } from './clients/thesis.grpc.client';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'THESIS_CLIENT',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: getThesisClientConfig,
      },
    ]),
  ],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
