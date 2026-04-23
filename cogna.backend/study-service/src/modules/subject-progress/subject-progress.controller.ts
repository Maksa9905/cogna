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

@Controller('subject-progress')
@StudySubjectProgressServiceControllerMethods()
export class SubjectProgressController implements StudySubjectProgressServiceController {
  constructor(
    private readonly subjectProgressService: SubjectProgressService,
  ) {}

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
