import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import {
  CreateTicketRequest,
  TicketResponse,
} from '@cogna-edu/contracts/dist/content/ticket';
import {
  DeleteTicketRequest,
  FindAllTicketsRequest,
  FindAllTicketsResponse,
  FindOneTicketRequest,
  GenerateThesesRequest,
  PatchTicketRequest,
} from '@cogna-edu/contracts/dist/content/ticket';
import {
  GenerateThesesRequest as GenThesesRequest,
  GenerateThesesResponse,
} from '@cogna-edu/contracts/dist/thesis/thesis';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { SuccessResponse } from '@cogna-edu/contracts/gen/content/common';
import { ThesisServiceClient } from '@cogna-edu/contracts/gen/thesis/thesis';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TicketService {
  private thesisClient: ThesisServiceClient;

  constructor(
    @Inject('THESIS_CLIENT') private readonly client: ClientGrpc,
    private readonly prismaService: PrismaService,
  ) {
    this.thesisClient = client.getService<ThesisServiceClient>('ThesisService');
  }

  public async createTicket(dto: CreateTicketRequest): Promise<TicketResponse> {
    const { subjectId, question, answer, theses } = dto;
    const ticket = await this.prismaService.ticket.create({
      data: {
        subjectId,
        question,
        answer,
        theses: {
          create: (theses || []).map((t) => ({
            value: t.value,
            importance: t.importance,
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
    const { id } = dto;
    const ticket = await this.prismaService.ticket.findUnique({
      where: { id },
      include: {
        theses: true,
      },
    });
    if (!ticket) throw new RpcException({});
    return { ticket: ticket };
  }

  public async findAllTickets(
    dto: FindAllTicketsRequest,
  ): Promise<FindAllTicketsResponse> {
    console.log(dto);
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
    return { tickets: tickets, totalCount: total_count };
  }

  public async patchTicket(dto: PatchTicketRequest): Promise<TicketResponse> {
    const { id, userId, answer, question, theses } = dto;

    const thesesUpdate =
      theses?.items !== undefined
        ? {
            deleteMany: {},
            create: theses.items.map((t) => ({
              value: t.value,
              importance: t.importance,
            })),
          }
        : undefined;

    try {
      const ticket = await this.prismaService.ticket.update({
        where: {
          id,
          subject: { userId },
        },
        data: {
          answer,
          question,
          theses: thesesUpdate,
        },
        include: { theses: true },
      });
      return { ticket: ticket ?? undefined };
    } catch {
      throw new RpcException({
        code: 5,
        message: 'Билет не найден или доступ запрещен',
      });
    }
  }

  public async deleteTicket(
    dto: DeleteTicketRequest,
  ): Promise<SuccessResponse> {
    const { id, userId } = dto;
    const result = await this.prismaService.ticket.deleteMany({
      where: {
        id,
        subject: {
          userId,
        },
      },
    });
    if (result.count === 0) throw new RpcException({});
    return { ok: true };
  }

  public async generateThesis(
    dto: GenerateThesesRequest,
  ): Promise<TicketResponse> {
    const { answer, question } = dto;
    const data: GenThesesRequest = { answer, question };
    const response: GenerateThesesResponse = await firstValueFrom(
      this.thesisClient.createThesis(data),
    );
    console.log(JSON.stringify(response, null, 2));
    const ticket = await this.prismaService.ticket.update({
      where: { id: dto.ticketId },
      data: {
        theses: {
          deleteMany: {},
          create: response.theses.map((t) => ({
            value: t.value,
            importance: t.importance,
          })),
        },
      },
      include: { theses: true },
    });
    if (!ticket) throw new RpcException({});
    return { ticket: ticket };
  }
}
