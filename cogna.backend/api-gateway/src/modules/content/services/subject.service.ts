import { Inject, Injectable } from '@nestjs/common';
import {
  CreateSubjectRequest,
  DeleteSubjectRequest,
  FindAllSubjectRequest,
  FindOneSubjectRequest,
  SubjectServiceClient,
  UpdateSubjectRequest,
} from '@cogna-edu/contracts/gen/content/subject';
import { ClientGrpc } from '@nestjs/microservices';
import { AsyncLocalStorage } from 'node:async_hooks';
import {
  createGrpcClientWithMetadata,
  UserContextStore,
  WithGrpcMetadata,
} from '../../../common/utils/grpc-with-metadata.util';

@Injectable()
export class SubjectService {
  private readonly subjectClient: WithGrpcMetadata<SubjectServiceClient>;

  constructor(
    @Inject('CONTENT_GRPC') client: ClientGrpc,
    @Inject('ALS') als: AsyncLocalStorage<UserContextStore>,
  ) {
    this.subjectClient = createGrpcClientWithMetadata(
      client.getService<SubjectServiceClient>('SubjectService'),
      als,
    );
  }

  public createSubject(dto: CreateSubjectRequest) {
    return this.subjectClient.createSubject(dto);
  }

  public findOneSubject(dto: FindOneSubjectRequest) {
    return this.subjectClient.findOneSubject(dto);
  }

  public findAllSubjects(dto: FindAllSubjectRequest) {
    return this.subjectClient.findAllSubjects(dto);
  }

  public updateSubject(dto: UpdateSubjectRequest) {
    return this.subjectClient.updateSubject(dto);
  }

  public deleteSubject(dto: DeleteSubjectRequest) {
    return this.subjectClient.deleteSubject(dto);
  }
}
