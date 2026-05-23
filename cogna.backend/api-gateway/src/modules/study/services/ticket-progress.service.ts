import {
  BatchTicketProgressBySubjectsRequest,
  FindAllTicketsProgressRequest,
  FindDueTicketsProgressRequest,
  FindOneTicketProgressRequest,
  StudyTicketProgressServiceClient,
} from '@cogna-edu/contracts/gen/study/ticket-progress';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class TicketProgressService {
  private ticketProgressClient: StudyTicketProgressServiceClient;

  constructor(
    @Inject('STUDY_GRPC_CLIENT') private readonly client: ClientGrpc,
  ) {
    this.ticketProgressClient =
      client.getService<StudyTicketProgressServiceClient>(
        'StudyTicketProgressService',
      );
  }

  public findOne(dto: FindOneTicketProgressRequest) {
    return this.ticketProgressClient.findOneTicketProgress(dto);
  }

  public findAll(dto: FindAllTicketsProgressRequest) {
    return this.ticketProgressClient.findAllTicketProgress(dto);
  }

  public batchBySubjects(dto: BatchTicketProgressBySubjectsRequest) {
    return this.ticketProgressClient.batchTicketProgressBySubjects(dto);
  }

  public findDueTicketsProgress(dto: FindDueTicketsProgressRequest) {
    return this.ticketProgressClient.findDueTicketsProgress(dto);
  }
}
