import { Module } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { MetadataInterceptor } from '../../common/interseptors/metadata.interceptor';

@Module({
  controllers: [SubjectController],
  providers: [SubjectService, MetadataInterceptor],
})
export class SubjectModule {}
