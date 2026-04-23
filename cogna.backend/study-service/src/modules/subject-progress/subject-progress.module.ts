import { Module } from '@nestjs/common';
import { SubjectProgressService } from './subject-progress.service';
import { SubjectProgressController } from './subject-progress.controller';
import { SubjectProgressRepository } from './subject-progress.repository';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  controllers: [SubjectProgressController],
  providers: [SubjectProgressService, SubjectProgressRepository],
  exports: [SubjectProgressRepository],
})
export class SubjectProgressModule {}
