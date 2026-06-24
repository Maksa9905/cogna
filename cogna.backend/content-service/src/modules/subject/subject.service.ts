import { Inject, Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';
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
    @Inject('ALS') private readonly als: AsyncLocalStorage<{ userId: string }>,
  ) {}

  public async createSubject(
    dto: CreateSubjectRequest,
  ): Promise<SubjectResponse> {
    const userId = this.requireUserId();
    const subject = await this.prismaService.subject.create({
      data: {
        title: dto.title,
        userId,
      },
    });
    return { subject };
  }

  public async findOneSubject(
    dto: FindOneSubjectRequest,
  ): Promise<SubjectResponse> {
    const userId = this.requireUserId();
    const subject = await this.prismaService.subject.findUnique({
      where: { id: dto.id },
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

    return { subject };
  }

  public async findAllSubjects(
    dto: FindAllSubjectRequest,
  ): Promise<FindAllSubjectsResponse> {
    const userId = this.requireUserId();
    const { limit, offset } = dto;
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

    return { subjects, totalCount };
  }

  public async updateSubject(
    dto: UpdateSubjectRequest,
  ): Promise<SubjectResponse> {
    const userId = this.requireUserId();
    const subject = await this.prismaService.subject.update({
      where: { id: dto.id, userId },
      data: { title: dto.title },
    });
    return { subject };
  }

  public async deleteObject(
    dto: DeleteSubjectRequest,
  ): Promise<SuccessResponse> {
    const userId = this.requireUserId();
    await this.prismaService.subject.delete({
      where: { id: dto.id, userId },
    });
    await this.studyKafkaClient.deleteSubjectProgress({
      id: dto.id,
      userId,
    });
    return { ok: true };
  }

  private requireUserId(): string {
    const userId = this.als.getStore()?.userId;
    if (!userId) {
      throw new RpcException({
        code: RpcStatus.UNAUTHENTICATED,
        message: 'missing user-id metadata',
      });
    }
    return userId;
  }
}
