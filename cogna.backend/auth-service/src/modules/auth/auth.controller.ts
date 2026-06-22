import { AuthService } from './auth.service';
import { GrpcMethod, GrpcService } from '@nestjs/microservices';
import {
  ConfirmRegisterRequest,
  JwtPayload,
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
} from '@cogna-edu/contracts/gen/auth/auth';

@GrpcService()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'Register')
  async register(data: RegisterRequest) {
    return await this.authService.register(data);
  }

  @GrpcMethod('AuthService', 'ConfirmRegister')
  async confirmRegister(data: ConfirmRegisterRequest) {
    return await this.authService.confirmRegister(data);
  }

  @GrpcMethod('AuthService', 'Login')
  async login(data: LoginRequest) {
    return await this.authService.login(data);
  }

  @GrpcMethod('AuthService', 'Logout')
  async logout(data: JwtPayload) {
    return await this.authService.logout(data);
  }

  @GrpcMethod('AuthService', 'RefreshTokens')
  async refresh(data: RefreshTokenRequest) {
    return await this.authService.refresh(data);
  }

  @GrpcMethod('AuthService', 'ValidateToken')
  async validateToken(data: JwtPayload) {
    return await this.authService.validateToken(data);
  }
}
