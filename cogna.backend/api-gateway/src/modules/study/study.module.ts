import { Module } from '@nestjs/common';
import { ClientsModule, GrpcOptions, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SubjectProgressFieldsResolver } from './resolvers/subject-progress.fields.resolver';
import { SubjectProgressResolver } from './resolvers/subject-progress.resolver';
import { TicketProgressFieldsResolver } from './resolvers/ticket-progress.fields.resolver';
import { TicketProgressResolver } from './resolvers/ticket-progress.resolver';
import { SubjectProgressService } from './services/subject-progress.service';
import { TicketAttemptLoadersService } from './services/ticket-attempt-loaders.service';
import { TicketAttemptService } from './services/ticket-attempt.service';
import { TicketProgressLoadersService } from './services/ticket-progress-loaders.service';
import { TicketProgressService } from './services/ticket-progress.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'STUDY_GRPC_CLIENT',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService): GrpcOptions => {
          const rootProtoDir = 'node_modules/@cogna-edu/contracts/proto';
          return {
            transport: Transport.GRPC,
            options: {
              url: config.getOrThrow<string>(
                'STUDY_GRPC_URL',
                'localhost:50056',
              ),
              package: [
                'study.subject.progress.v1',
                'study.ticket.attempt.v1',
                'study.ticket.progress.v1',
              ],
              // Теперь пути указываем ОТНОСИТЕЛЬНО rootProtoDir
              protoPath: [
                'study/subject-progress.proto',
                'study/ticket-progress.proto',
                'study/ticket-attempt.proto',
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
  providers: [
    SubjectProgressResolver,
    SubjectProgressFieldsResolver,
    TicketProgressFieldsResolver,
    TicketProgressResolver,
    SubjectProgressService,
    TicketAttemptService,
    TicketAttemptLoadersService,
    TicketProgressService,
    TicketProgressLoadersService,
  ],
  exports: [ClientsModule, SubjectProgressService],
})
export class StudyModule {}
