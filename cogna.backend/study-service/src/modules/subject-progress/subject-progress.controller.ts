import { Controller } from '@nestjs/common';
import { SubjectProgressService } from './subject-progress.service';
import {
  FindAllSubjectProgressRequest,
  FindAllSubjectProgressResponse,
  FindOneSubjectProgressRequest,
  FindOneSubjectProgressResponse,
  StudySubjectProgressServiceController,
} from '@cogna-edu/contracts/gen/study/subject-progress';

import { StudySubjectProgressServiceControllerMethods } from '@cogna-edu/contracts/dist/study/subject-progress';
import { EventPattern } from '@nestjs/microservices';
import { DeleteSubjectProgressEvent } from '@cogna-edu/contracts/gen/events/study/subject_progress';

@Controller('subject-progress')
@StudySubjectProgressServiceControllerMethods()
export class SubjectProgressController implements StudySubjectProgressServiceController {
  constructor(
    private readonly subjectProgressService: SubjectProgressService,
  ) {}

  @EventPattern('study.delete.subject.progress')
  public async deleteSubjectProgress(dto: DeleteSubjectProgressEvent) {
    await this.subjectProgressService.delete(dto);
  }

  findAllSubjectsProgress(
    request: FindAllSubjectProgressRequest,
  ): Promise<FindAllSubjectProgressResponse> {
    return this.subjectProgressService.findAll(request);
  }

  findOneSubjectProgress(
    request: FindOneSubjectProgressRequest,
  ): Promise<FindOneSubjectProgressResponse> {
    return this.subjectProgressService.findOne(request);
  }
}
