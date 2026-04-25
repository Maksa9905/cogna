import { Injectable, Logger } from '@nestjs/common';
import { TicketProgressRepository } from './ticket-progress.repository';
import {
  BatchTicketProgressBySubjectsRequest,
  FindAllTicketsProgressRequest,
  FindAllTicketsProgressResponse,
  FindOneTicketProgressRequest,
  FindOneTicketProgressResponse,
  TicketProgress as TicketProgressGrpc,
} from '@cogna-edu/contracts/gen/study/ticket-progress';
import { RpcException } from '@nestjs/microservices';
import { TicketProgress as TicketProgressPrisma } from '../../../prisma/generated/client';

@Injectable()
export class TicketProgressService {
  private logger: Logger;

  constructor(
    private readonly ticketProgressRepository: TicketProgressRepository,
  ) {
    this.logger = new Logger('TicketProgressService');
  }

  public async findOne(
    dto: FindOneTicketProgressRequest,
  ): Promise<FindOneTicketProgressResponse> {
    const ticketProgress = await this.ticketProgressRepository.findOne(
      dto.userId,
      dto.ticketId,
    );
    if (!ticketProgress) throw new RpcException({});

    return {
      ticketProgress: this.mapPrismaToGrpc(ticketProgress),
    };
  }

  public async findAll(
    dto: FindAllTicketsProgressRequest,
  ): Promise<FindAllTicketsProgressResponse> {
    const tickets = await this.ticketProgressRepository.findAll(
      dto.userId,
      dto.subjectId,
    );

    return {
      ticketsProgress: tickets.map((t) => {
        return this.mapPrismaToGrpc(t);
      }),
    };
  }

  public async batchTicketsBySubjects(
    dto: BatchTicketProgressBySubjectsRequest,
  ): Promise<FindAllTicketsProgressResponse> {
    this.logger.debug('Batch TicketsBySubjects');

    const tickets = await this.ticketProgressRepository.batchBySubjects(
      dto.userId,
      dto.subjectIds,
    );

    return {
      ticketsProgress: tickets.map((t) => {
        return this.mapPrismaToGrpc(t);
      }),
    };
  }

  private mapPrismaToGrpc(
    ticketProgress: TicketProgressPrisma,
  ): TicketProgressGrpc {
    return {
      id: ticketProgress.id,
      ticketId: ticketProgress.ticketId,
      userId: ticketProgress.userId,
      subjectId: ticketProgress.subjectId,
      totalCount: ticketProgress.totalCount,
      bestScore: ticketProgress.bestScore,
      lastScore: ticketProgress.lastScore,
      averageScore: ticketProgress.averageScore,
      createdAt: ticketProgress.createdAt,
      updatedAt: ticketProgress.updatedAt,
    };
  }
}
