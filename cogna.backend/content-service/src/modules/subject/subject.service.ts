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
import { SuccessResponse } from '@cogna-edu/contracts/gen/content/common';

@Injectable()
export class SubjectService {
  constructor(private readonly prismaService: PrismaService) {}

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

    if (!subject) throw new RpcException({});
    if (subject.userId !== userId) throw new RpcException({});

    return { subject: subject };
  }

  public async findAllSubjects(
    dto: FindAllSubjectRequest,
  ): Promise<FindAllSubjectsResponse> {
    const { userId } = dto;
    const subjects = await this.prismaService.subject.findMany({
      where: { userId },
    });

    return { subjects: subjects };
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
    return { ok: true };
  }
}
