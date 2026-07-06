import { Inject, Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';
import { PrismaService } from '../../infra/prisma/prisma.service';
import {
  CreateTicketRequest,
  PatchTicketRequest,
  ThesisInput,
  Ticket,
  TicketResponse,
} from '@cogna-edu/contracts/dist/content/ticket';
import {
  DeleteTicketRequest,
  FindAllTicketsRequest,
  FindAllTicketsResponse,
  FindOneTicketRequest,
  GenerateThesesRequest,
} from '@cogna-edu/contracts/dist/content/ticket';
import {
  GenerateAnswerRequest,
  GenerateAnswerResponse,
  GenerateThesesRequest as GenThesesRequest,
  GenerateThesesResponse,
} from '@cogna-edu/contracts/dist/thesis/thesis';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { RpcStatus } from '@cogna-edu/corn';
import { SuccessResponse } from '@cogna-edu/contracts/gen/content/common';
import { ThesisServiceClient } from '@cogna-edu/contracts/gen/thesis/thesis';
import { firstValueFrom } from 'rxjs';
import { Importance } from '../../../prisma/generated/enums';

const ImportanceMap: Record<number, Importance> = {
  0: 'LOW',
  1: 'MEDIUM',
  2: 'HIGH',
};

const toImportance = (v: string | number): Importance =>
  typeof v === 'string' ? (v as Importance) : (ImportanceMap[v] ?? 'LOW');

@Injectable()
export class TicketService {
  private thesisClient: ThesisServiceClient;

  constructor(
    @Inject('THESIS_CLIENT') private readonly client: ClientGrpc,
    @Inject('ALS') private readonly als: AsyncLocalStorage<{ userId: string }>,
    private readonly prismaService: PrismaService,
  ) {
    this.thesisClient = client.getService<ThesisServiceClient>('ThesisService');
  }

  public async createTicket(dto: CreateTicketRequest): Promise<TicketResponse> {
    const userId = this.requireUserId();
    await this.requireOwnedSubject(dto.subjectId, userId);

    const { subjectId, question, answer, theses } = dto;
    const ticket = await this.prismaService.ticket.create({
      data: {
        subjectId,
        question,
        answer,
        theses: {
          create: (theses || []).map((t) => ({
            value: t.value,
            importance: toImportance(t.importance),
          })),
        },
      },
      include: { theses: true },
    });
    return { ticket: { ...ticket, theses: [] } };
  }

  public async findOneTicket(
    dto: FindOneTicketRequest,
  ): Promise<TicketResponse> {
    const userId = this.requireUserId();
    const ticket = await this.prismaService.ticket.findFirst({
      where: {
        id: dto.id,
        subject: { userId },
      },
      include: { theses: true },
    });
    if (!ticket) {
      throw new RpcException({
        code: RpcStatus.NOT_FOUND,
        message: 'ticket not found',
      });
    }
    return { ticket: ticket as Ticket };
  }

  public async findAllTickets(
    dto: FindAllTicketsRequest,
  ): Promise<FindAllTicketsResponse> {
    const userId = this.requireUserId();
    await this.requireOwnedSubject(dto.subjectId, userId);

    const { subjectId, limit, offset } = dto;
    const [tickets, total_count] = await Promise.all([
      this.prismaService.ticket.findMany({
        where: { subjectId },
        take: limit,
        skip: offset,
        include: { theses: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.ticket.count({
        where: { subjectId },
      }),
    ]);
    return { tickets: tickets as Ticket[], totalCount: total_count };
  }

  public async patchTicket(dto: PatchTicketRequest): Promise<TicketResponse> {
    const userId = this.requireUserId();
    const { id, answer, question, theses } = dto;

    try {
      const ticket = await this.prismaService.$transaction(async (tx) => {
        await tx.ticket.update({
          where: { id, subject: { userId } },
          data: { answer, question },
        });

        if (theses?.items) {
          const toUpdate = theses.items.filter(
            (t): t is ThesisInput & { id: string } => !!t.id,
          );
          const toCreate = theses.items.filter((t) => !t.id);

          for (const t of toUpdate) {
            await tx.thesis.update({
              where: { id: t.id },
              data: { value: t.value, importance: toImportance(t.importance) },
            });
          }

          for (const t of toCreate) {
            await tx.thesis.create({
              data: {
                ticketId: id,
                value: t.value,
                importance: toImportance(t.importance),
              },
            });
          }
        }

        return tx.ticket.findUnique({
          where: { id },
          include: { theses: true },
        });
      });

      return { ticket: (ticket as Ticket) ?? undefined };
    } catch {
      throw new RpcException({
        code: RpcStatus.NOT_FOUND,
        message: 'ticket not found or access denied',
      });
    }
  }

  public async deleteTicket(
    dto: DeleteTicketRequest,
  ): Promise<SuccessResponse> {
    const userId = this.requireUserId();
    const result = await this.prismaService.ticket.deleteMany({
      where: {
        id: dto.id,
        subject: { userId },
      },
    });
    if (result.count === 0) {
      throw new RpcException({
        code: RpcStatus.NOT_FOUND,
        message: 'ticket not found or access denied',
      });
    }
    return { ok: true };
  }

  public async generateThesis(
    dto: GenerateThesesRequest,
  ): Promise<TicketResponse> {
    const userId = this.requireUserId();
    const existing = await this.prismaService.ticket.findFirst({
      where: { id: dto.ticketId, subject: { userId } },
      select: { id: true },
    });
    if (!existing) {
      throw new RpcException({
        code: RpcStatus.NOT_FOUND,
        message: 'ticket not found',
      });
    }

    const { answer, question } = dto;
    const data: GenThesesRequest = { answer, question };
    const response: GenerateThesesResponse = await firstValueFrom(
      this.thesisClient.createThesis(data),
    );
    const ticket = await this.prismaService.ticket.update({
      where: { id: dto.ticketId },
      data: {
        theses: {
          deleteMany: {},
          create: response.theses.map((t) => ({
            value: t.value,
            importance: toImportance(t.importance),
          })),
        },
      },
      include: { theses: true },
    });
    return { ticket: ticket as Ticket };
  }

  public async generateAnswer(
    dto: GenerateAnswerRequest,
  ): Promise<GenerateAnswerResponse> {
    return firstValueFrom(this.thesisClient.generateAnswer(dto));
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

  private async requireOwnedSubject(subjectId: string, userId: string) {
    const subject = await this.prismaService.subject.findFirst({
      where: { id: subjectId, userId },
      select: { id: true },
    });
    if (!subject) {
      throw new RpcException({
        code: RpcStatus.PERMISSION_DENIED,
        message: 'access to subject denied',
      });
    }
  }
}
