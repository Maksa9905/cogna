import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { JwtResponseGql, SuccessResponseGql } from './dto/responses';
import { ConfirmRegisterRequestGql, RegisterRequestGql } from './dto/requests';
import { Request, Response } from 'express';
import { LoginRequestGql } from './dto/requests/login.request';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../../common/guards';
import { Protected } from '../../../common/decorators/protected.decorator';
import { UserRole } from '@cogna-edu/corn/dist/enum/user-role.enum';
//
// @Roles(ROLES_ENUM.USER)
@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  // @Roles(ROLES_ENUM.USER, ROLES_ENUM.ADMIN)
  // @UseGuards(JwtGuard)
  @Protected(UserRole.USER)
  @Query(() => String)
  public ping() {
    // throw new Error('тест фильтра');
    return 'pong';
  }

  @UseGuards(JwtGuard)
  @Query(() => JwtResponseGql)
  public checkTokens(@Context('req') req: Request): JwtResponseGql {
    const bearer = req.header('authorization');
    if (!bearer) throw new NotFoundException();
    return {
      accessToken: bearer.split(' ')[1],
      refreshToken: req.cookies?.refreshToken as string,
    };
  }

  @Mutation(() => SuccessResponseGql)
  public async register(@Args('data') data: RegisterRequestGql) {
    return await this.authService.register(data);
  }

  @Mutation(() => JwtResponseGql)
  public async confirmRegister(
    @Args('data') data: ConfirmRegisterRequestGql,
    @Context('res') res: Response,
  ) {
    // можно брать user-agent, ip и т.д. из req
    const { accessToken, refreshToken } =
      await this.authService.confirmRegister(data);
    res.cookie('refreshToken', refreshToken);
    return { accessToken, refreshToken };
  }

  @Mutation(() => JwtResponseGql)
  public async login(
    @Args('data') dto: LoginRequestGql,
    @Context('res') res: Response,
  ) {
    const response = await this.authService.login(dto);
    res.cookie('refreshToken', response.refreshToken);
    return response;
  }

  @UseGuards(JwtGuard)
  @Mutation(() => SuccessResponseGql)
  public async logout(
    @Context('req') req: Request,
    @Context('res') res: Response,
  ) {
    const response = await this.authService.logout({
      refreshTokenId: req.user.refreshTokenId,
      sub: req.user.sub,
    });
    res.clearCookie('refreshToken');
    return response;
  }

  @UseGuards(JwtGuard)
  @Mutation(() => JwtResponseGql)
  public async refreshTokens(
    @Context('req') req: Request,
    @Context('res') res: Response,
  ) {
    const { sub, refreshTokenId } = req.user;
    const response = await this.authService.refreshTokens({
      refreshTokenId: refreshTokenId,
      sub,
    });
    res.cookie('refreshToken', response.refreshToken);
    return response;
  }
}
