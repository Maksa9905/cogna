import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  RegisterRequest,
  AuthServiceClient,
  ConfirmRegisterRequest,
  LoginRequest,
  JwtPayload,
} from '@cogna-edu/contracts/gen/auth/auth';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  private authClient: AuthServiceClient;

  constructor(@Inject('AUTH_GRPC') private readonly client: ClientGrpc) {
    this.authClient = client.getService<AuthServiceClient>('AuthService');
  }

  public async register(dto: RegisterRequest) {
    return await firstValueFrom(this.authClient.register(dto));
  }

  public async confirmRegister(dto: ConfirmRegisterRequest) {
    return await firstValueFrom(this.authClient.confirmRegister(dto));
  }

  public async login(dto: LoginRequest) {
    return await firstValueFrom(this.authClient.login(dto));
  }

  public async logout(dto: JwtPayload) {
    return await firstValueFrom(this.authClient.logout(dto));
  }

  public async refreshTokens(dto: JwtPayload) {
    return await firstValueFrom(this.authClient.refreshTokens(dto));
  }

  public async validateToken(dto: JwtPayload) {
    return await firstValueFrom(this.authClient.validateToken(dto));
  }
}
