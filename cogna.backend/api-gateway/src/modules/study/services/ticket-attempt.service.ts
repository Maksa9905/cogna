import {
  BatchTicketAttemptsRequest,
  StudyTicketAttemptServiceClient,
} from '@cogna-edu/contracts/gen/study/ticket-attempt';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class TicketAttemptService {
  private studyTicketAttemptClient: StudyTicketAttemptServiceClient;

  constructor(
    @Inject('STUDY_GRPC_CLIENT') private readonly client: ClientGrpc,
  ) {
    this.studyTicketAttemptClient =
      client.getService<StudyTicketAttemptServiceClient>(
        'StudyTicketAttemptService',
      );
  }

  public batchByTicketProgress(dto: BatchTicketAttemptsRequest) {
    return this.studyTicketAttemptClient.batchTicketAttemptsByTicketProgress(
      dto,
    );
  }
}
