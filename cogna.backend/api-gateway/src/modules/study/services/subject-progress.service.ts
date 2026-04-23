import {
  FindAllSubjectProgressRequest,
  FindOneSubjectProgressRequest,
  StudySubjectProgressServiceClient,
} from '@cogna-edu/contracts/gen/study/subject-progress';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class SubjectProgressService {
  private subjectProgressClient: StudySubjectProgressServiceClient;

  constructor(
    @Inject('STUDY_GRPC_CLIENT') private readonly client: ClientGrpc,
  ) {
    this.subjectProgressClient =
      client.getService<StudySubjectProgressServiceClient>(
        'StudySubjectProgressService',
      );
  }

  public findOne(dto: FindOneSubjectProgressRequest) {
    return this.subjectProgressClient.findOneSubjectProgress(dto);
  }

  public findAll(dto: FindAllSubjectProgressRequest) {
    return this.subjectProgressClient.findAllSubjectsProgress(dto);
  }
}
