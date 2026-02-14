import { PrismaService } from '../../infra/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  //users
  public async findOneByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }

  public async findOne(id: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  public async create(data: Prisma.UserCreateInput) {
    const { email, passwordHash } = data;
    return this.prismaService.user.create({
      data: { email, passwordHash },
    });
  }

  //refresh_tokens
  public async createRefreshToken(
    data: Prisma.RefreshTokensUncheckedCreateInput,
  ) {
    const { userId, tokenHash, expiredAt } = data;
    return this.prismaService.refreshTokens.create({
      data: { userId, tokenHash, expiredAt },
    });
  }

  public async findRefreshToken(refreshTokenId: string) {
    return this.prismaService.refreshTokens.findUnique({
      where: { id: refreshTokenId },
    });
  }

  public async deleteRefreshToken(refreshTokenId: string) {
    return this.prismaService.refreshTokens.delete({
      where: { id: refreshTokenId },
    });
  }
}
