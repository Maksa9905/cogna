import { Injectable } from '@nestjs/common';
import { SubjectProgressRepository } from './subject-progress.repository';
import {
  FindAllSubjectProgressRequest,
  FindAllSubjectProgressResponse,
  FindOneSubjectProgressRequest,
  FindOneSubjectProgressResponse,
  SubjectProgress,
} from '@cogna-edu/contracts/gen/study/subject-progress';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class SubjectProgressService {
  constructor(
    private readonly subjectProgressRepository: SubjectProgressRepository,
  ) {}

  public async findOne(
    dto: FindOneSubjectProgressRequest,
  ): Promise<FindOneSubjectProgressResponse> {
    const subject = await this.subjectProgressRepository.findOne(
      dto.userId,
      dto.subjectId,
    );

    if (!subject) throw new RpcException({});

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
