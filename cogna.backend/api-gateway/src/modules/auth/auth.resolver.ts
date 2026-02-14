import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { JwtResponseGql, SuccessResponseGql } from './dto/responses';
import { ConfirmRegisterRequestGql, RegisterRequestGql } from './dto/requests';
import { Request, Response } from 'express';
import { LoginRequestGql } from './dto/requests/login.request';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => String)
  public ping() {
    return 'pong';
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

  @Mutation(() => SuccessResponseGql)
  public async logout(
    @Context('req') req: Request,
    @Context('res') res: Response,
  ) {
    const refreshToken = req.cookies?.refreshToken as string;
    if (!refreshToken) return { ok: true };
    const response = await this.authService.logout({
      refreshTokenId: refreshToken,
      sub: '123',
    });
    res.clearCookie('refreshToken');
    return response;
  }

  @Mutation(() => JwtResponseGql)
  public async refresh(
    @Context('req') req: Request,
    @Context('res') res: Response,
  ) {
    const refreshToken = req.cookies?.refreshToken as string;
    const response = await this.authService.refresh({
      refreshTokenId: refreshToken,
      sub: '123',
    });
    res.cookie('refreshToken', response.refreshToken);
    return response;
  }
}
