import { SubjectService } from './subject.service';
import { GrpcMethod, GrpcService } from '@nestjs/microservices';
import {
  CreateSubjectRequest,
  DeleteSubjectRequest,
  FindAllSubjectRequest,
  FindAllSubjectsResponse,
  FindOneSubjectRequest,
  SubjectResponse,
  SubjectServiceController,
  UpdateSubjectRequest,
} from '@cogna-edu/contracts/gen/content/subject';
import { SubjectServiceControllerMethods } from '@cogna-edu/contracts/dist/content/subject';
import { SuccessResponse } from '@cogna-edu/contracts/gen/content/common';

@GrpcService()
@SubjectServiceControllerMethods()
export class SubjectController implements SubjectServiceController {
  constructor(
    private readonly subjectService: SubjectService,
  ) {}

  createSubject(request: CreateSubjectRequest): Promise<SubjectResponse> {
    return this.subjectService.createSubject(request);
  }

  deleteSubject(request: DeleteSubjectRequest): Promise<SuccessResponse> {
    return this.subjectService.deleteObject(request);
  }

  findAllSubjects(
    request: FindAllSubjectRequest,
  ): Promise<FindAllSubjectsResponse> {
    return this.subjectService.findAllSubjects(request);
  }

  findOneSubject(request: FindOneSubjectRequest): Promise<SubjectResponse> {
    return this.subjectService.findOneSubject(request);
  }

  updateSubject(request: UpdateSubjectRequest): Promise<SubjectResponse> {
    return this.subjectService.updateSubject(request);
  }
}
