import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async getUserInfo(userId: string) {
    return this.prismaService.user.findUnique({
      where: { id: userId },
    });
  }
}
