import { Module } from '@nestjs/common';
import { SubjectProgressService } from './subject-progress.service';
import { SubjectProgressController } from './subject-progress.controller';
import { SubjectProgressRepository } from './subject-progress.repository';

@Module({
  controllers: [SubjectProgressController],
  providers: [SubjectProgressService, SubjectProgressRepository],
  exports: [SubjectProgressRepository],
})
export class SubjectProgressModule {}
