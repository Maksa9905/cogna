import { Inject, Injectable } from '@nestjs/common';
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
    const { id } = dto;
    const ticket = await this.prismaService.ticket.findUnique({
      where: { id },
      include: {
        theses: true,
      },
    });
    if (!ticket) throw new RpcException({});
    return { ticket: ticket as Ticket };
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
    return { tickets: tickets as Ticket[], totalCount: total_count };
  }

  public async patchTicket(dto: PatchTicketRequest): Promise<TicketResponse> {
    const { id, userId, answer, question, theses } = dto;

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
            console.log(`t importande: ${t.importance}}`);
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
    } catch (e) {
      console.error(e);
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
            importance: toImportance(t.importance),
          })),
        },
      },
      include: { theses: true },
    });
    if (!ticket) throw new RpcException({});
    return { ticket: ticket as Ticket };
  }

  public async generateAnswer(
    dto: GenerateAnswerRequest,
  ): Promise<GenerateAnswerResponse> {
    return firstValueFrom(this.thesisClient.generateAnswer(dto));
  }
}
