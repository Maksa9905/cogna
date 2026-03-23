import { Controller } from '@nestjs/common';
import { SubjectProgressService } from './subject-progress.service';

@Controller('subject-progress')
export class SubjectProgressController {
  constructor(private readonly subjectProgressService: SubjectProgressService) {}
}
