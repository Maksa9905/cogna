import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TicketResolver } from './resolvers/ticket.resolver';
import { SubjectResolver } from './resolvers/subject.resolver';
import { SubjectService } from './services/subject.service';
import { TicketService } from './services/ticket.service';
import { StudyModule } from '../study/study.module';

@Module({
  imports: [
    StudyModule,
    ClientsModule.registerAsync([
      {
        name: 'CONTENT_GRPC',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => {
          const rootProtoDir = 'node_modules/@cogna-edu/contracts/proto';
          return {
            transport: Transport.GRPC,
            options: {
              url: config.getOrThrow<string>(
                'CONTENT_GRPC_URL',
                'localhost:50052',
              ),
              package: ['common.content.v1', 'subject.v1', 'ticket.v1'],
              // Теперь пути указываем ОТНОСИТЕЛЬНО rootProtoDir
              protoPath: [
                'content/common.proto',
                'content/subject.proto',
                'content/ticket.proto',
              ],
              loader: {
                keepCase: false,
                longs: String,
                enums: String,
                defaults: true,
                // Обязательно передаем этот же корень сюда
                includeDirs: [rootProtoDir],
              },
            },
          };
        },
      },
    ]),
  ],
  providers: [SubjectService, TicketService, SubjectResolver, TicketResolver],
})
export class ContentModule {}
