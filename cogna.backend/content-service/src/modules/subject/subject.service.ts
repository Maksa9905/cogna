import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import {
  CreateSubjectRequest,
  DeleteSubjectRequest,
  FindAllSubjectRequest,
  FindAllSubjectsResponse,
  FindOneSubjectRequest,
  SubjectResponse,
  UpdateSubjectRequest,
} from '@cogna-edu/contracts/gen/content/subject';
import { RpcException } from '@nestjs/microservices';
import { RpcStatus } from '@cogna-edu/corn';
import { SuccessResponse } from '@cogna-edu/contracts/gen/content/common';
import { KafkaStudyClient } from '../../infra/kafka/clients/kafka-study.client';

@Injectable()
export class SubjectService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly studyKafkaClient: KafkaStudyClient,
  ) {}

  public async createSubject(
    dto: CreateSubjectRequest,
  ): Promise<SubjectResponse> {
    const { title, userId } = dto;
    const subject = await this.prismaService.subject.create({
      data: {
        title,
        userId,
      },
    });
    return { subject: subject };
  }

  public async findOneSubject(
    dto: FindOneSubjectRequest,
  ): Promise<SubjectResponse> {
    const { userId, id } = dto;

    const subject = await this.prismaService.subject.findUnique({
      where: { id },
    });

    if (!subject) {
      throw new RpcException({
        code: RpcStatus.NOT_FOUND,
        message: 'subject not found',
      });
    }
    if (subject.userId !== userId) {
      throw new RpcException({
        code: RpcStatus.PERMISSION_DENIED,
        message: 'access to subject denied',
      });
    }

    return { subject: subject };
  }

  public async findAllSubjects(
    dto: FindAllSubjectRequest,
  ): Promise<FindAllSubjectsResponse> {
    const { userId, limit, offset } = dto;
    const [subjects, totalCount] = await Promise.all([
      this.prismaService.subject.findMany({
        where: { userId },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.subject.count({
        where: { userId },
      }),
    ]);

    return { subjects: subjects, totalCount: totalCount };
  }

  public async updateSubject(
    dto: UpdateSubjectRequest,
  ): Promise<SubjectResponse> {
    const { id, userId, title } = dto;
    const subject = await this.prismaService.subject.update({
      where: { id, userId },
      data: { title },
    });
    return { subject: subject };
  }

  public async deleteObject(
    dto: DeleteSubjectRequest,
  ): Promise<SuccessResponse> {
    const { id, userId } = dto;
    await this.prismaService.subject.delete({
      where: { id, userId },
    });
    await this.studyKafkaClient.deleteSubjectProgress(dto);
    return { ok: true };
  }
}
