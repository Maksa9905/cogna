import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';

@Injectable()
export class TicketProgressRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async findOne(userId: string, ticketId: string) {
    return this.prismaService.ticketProgress.findUnique({
      where: { userId_ticketId: { userId, ticketId } },
    });
  }

  public async findAll(userId: string, subjectId: string) {
    return this.prismaService.ticketProgress.findMany({
      where: { userId, subjectId },
    });
  }

  public async batchBySubjects(userId: string, subjectIds: string[]) {
    return this.prismaService.ticketProgress.findMany({
      where: { userId, subjectId: { in: subjectIds } },
    });
  }
}
