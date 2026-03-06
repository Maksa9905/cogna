import {
  CreateSubjectRequest,
  DeleteSubjectRequest,
  FindAllSubjectRequest,
  FindOneSubjectRequest,
  SubjectServiceClient,
  UpdateSubjectRequest,
} from '@cogna-edu/contracts/gen/content/subject';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  CreateSubjectRequestGql,
  FindAllSubjectsRequestGql,
  FindOneSubjectRequestGql,
  UserIdRequestGql,
} from '../dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SubjectService {
  private subjectClient: SubjectServiceClient;

  constructor(@Inject('CONTENT_GRPC') private readonly client: ClientGrpc) {
    this.subjectClient =
      client.getService<SubjectServiceClient>('SubjectService');
  }

  public async createSubject(dto: CreateSubjectRequest) {
    console.log(dto);
    return await firstValueFrom(this.subjectClient.createSubject(dto));
  }

  public async findOneSubject(dto: FindOneSubjectRequest) {
    console.log(dto);
    return await firstValueFrom(this.subjectClient.findOneSubject(dto));
  }

  public async findAllSubjects(dto: FindAllSubjectRequest) {
    console.log(dto);
    return await firstValueFrom(this.subjectClient.findAllSubjects(dto));
  }

  public async updateSubject(dto: UpdateSubjectRequest) {
    return await firstValueFrom(this.subjectClient.updateSubject(dto));
  }

  public async deleteSubject(dto: DeleteSubjectRequest) {
    return await firstValueFrom(this.subjectClient.deleteSubject(dto));
  }
}
