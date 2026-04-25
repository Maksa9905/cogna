import { Injectable, Logger } from '@nestjs/common';
import { SubjectProgressRepository } from './subject-progress.repository';
import {
  FindAllSubjectProgressRequest,
  FindAllSubjectProgressResponse,
  FindOneSubjectProgressRequest,
  FindOneSubjectProgressResponse,
  SubjectProgress,
} from '@cogna-edu/contracts/gen/study/subject-progress';

@Injectable()
export class SubjectProgressService {
  private logger: Logger;

  constructor(
    private readonly subjectProgressRepository: SubjectProgressRepository,
  ) {
    this.logger = new Logger('SubjectProgressService');
  }

  public async findOne(
    dto: FindOneSubjectProgressRequest,
  ): Promise<FindOneSubjectProgressResponse> {
    this.logger.log(
      `userId: ${dto.userId.slice(0, 7)}, subjectId: ${dto.subjectId}`,
    );

    const subject = await this.subjectProgressRepository.findOne(
      dto.userId,
      dto.subjectId,
    );

    if (!subject) {
      this.logger.debug('Предмет не найден');
      return { subjectProgress: undefined };
    }

    const response: FindOneSubjectProgressResponse = {
      subjectProgress: {
        id: subject.id,
        subjectId: subject.subjectId,
        userId: subject.userId,
        studiedTickets: subject.studiedTickets,
        averageTicketsScore: subject.averageTicketsScore,
        lastRepetitionData: subject.lastRepetitionDate ?? undefined,
        updatedAt: subject.updatedAt,
        createdAt: subject.createdAt,
      },
    };

    return response;
  }

  public async findAll(
    dto: FindAllSubjectProgressRequest,
  ): Promise<FindAllSubjectProgressResponse> {
    const subjectsPrisma = await this.subjectProgressRepository.findAll(
      dto.userId,
    );
    const formattedSubjects = subjectsPrisma.map(
      (subject): SubjectProgress => ({
        id: subject.id,
        subjectId: subject.subjectId,
        userId: subject.userId,
        studiedTickets: subject.studiedTickets,
        averageTicketsScore: subject.averageTicketsScore,
        lastRepetitionData: subject.lastRepetitionDate ?? undefined,
        updatedAt: subject.updatedAt,
        createdAt: subject.createdAt,
      }),
    );
    return {
      subjectsProgress: formattedSubjects,
    };
  }
}
