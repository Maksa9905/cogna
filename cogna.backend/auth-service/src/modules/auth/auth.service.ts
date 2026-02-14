import { Injectable, Logger } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import {
  ConfirmRegisterRequest,
  JwtPayload,
  JwtResponse,
  LoginRequest,
  RegisterRequest,
  SuccessResponse,
} from '@cogna-edu/contracts/gen/auth';
import { RpcException } from '@nestjs/microservices';
import { hash, verify } from 'argon2';
import { AuthRegisterCache } from './auth-register.cache';
import { KafkaNotificationClient } from '../../infra/kafka/clients/kafka-notification.client';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import * as ms from 'ms';
import { StringValue } from 'ms';
import { randomUUID } from 'node:crypto';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  private readonly JWT_EXPIRES_IN: StringValue;
  private readonly JWT_REFRESH_EXPIRES_IN: StringValue;

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly authRegisterCache: AuthRegisterCache,
    private readonly notificationClient: KafkaNotificationClient,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.JWT_EXPIRES_IN =
      configService.getOrThrow<StringValue>('JWT_EXPIRES_IN');
    this.JWT_REFRESH_EXPIRES_IN = this.configService.getOrThrow<StringValue>(
      'JWT_REFRESH_EXPIRES_IN',
    );
  }

  public async register(data: RegisterRequest): Promise<SuccessResponse> {
    const { email, password } = data;
    this.logger.log(data);

    //проверка уже зарегестрированой почты
    const isExist = await this.authRepository.findOneByEmail(email);
    if (isExist) {
      this.logger.error('user already registered', { email });
      throw new RpcException({
        code: 409,
        message: 'user already registered',
      });
    }

    //генерация кода подверждения и временное сохранение в редис
    const code = 555000;
    const hashPassword = await hash(password);
    await this.authRegisterCache.save({
      email,
      password: hashPassword,
      otp: code,
    });
    this.logger.log('register otp saved', { email });

    //отправляем письмо с кодом на почту
    await this.notificationClient.sendOtp({ email, otp: code });
    this.logger.log('register otp send in email', { email });
    return { ok: true };
  }

  public async confirmRegister(
    data: ConfirmRegisterRequest,
  ): Promise<JwtResponse> {
    const { email, otp } = data;

    //берем данные из редиса
    const redisData = await this.authRegisterCache.get(email);
    if (!redisData) {
      throw new RpcException({
        code: 404,
        message: 'redis data not found',
      });
    }

    //проверяем валидность пароля
    const isValidOtp = otp === redisData.otp;
    if (!isValidOtp) {
      throw new RpcException({
        code: 409,
        message: 'invalid otp',
      });
    }

    //создаем пользователя
    const user = await this.authRepository.create({
      email: redisData.email,
      passwordHash: redisData.password,
    });

    //генерируем токены
    const { accessToken, refreshToken } = await this.generateTokens(user);

    this.logger.log('user created', { email });

    return { accessToken, refreshToken };
  }

  public async login(dto: LoginRequest): Promise<JwtResponse> {
    const { email, password } = dto;

    //Проверка данных пользователя
    const user = await this.authRepository.findOneByEmail(email);
    if (!user) {
      throw new RpcException({
        code: 404,
        message: 'user not found',
      });
    }

    const isValidPassword = await verify(user.passwordHash, password);
    if (!isValidPassword) {
      throw new RpcException({
        code: 409,
        message: 'password not valid',
      });
    }
    this.logger.log('next');

    //Генерация новых токенов
    return this.generateTokens(user);
  }

  public async logout(dto: JwtPayload) {
    const { sub, refreshTokenId } = dto;
    await this.authRepository.deleteRefreshToken(refreshTokenId);
    return { ok: true };
  }

  public async refresh(dto: JwtPayload) {
    const { sub, refreshTokenId } = dto;
    const token = await this.authRepository.findRefreshToken(refreshTokenId);
    if (!token) {
      throw new RpcException({
        code: 404,
        message: 'refresh token not found',
      });
    }

    if (sub != token.userId) {
      throw new RpcException({
        code: 409,
        message: 'the token belongs another user',
      });
    }

    const user = await this.authRepository.findOne(sub);
    if (!user) {
      throw new RpcException({
        code: 404,
        message: 'user not found',
      });
    }

    return this.generateTokens(user);
  }

  private async generateTokens(user: User) {
    const refreshTTL = new Date(Date.now() + ms(this.JWT_REFRESH_EXPIRES_IN));
    const refreshId = randomUUID();

    const payload = { sub: user.id, refreshId };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.JWT_EXPIRES_IN,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.JWT_REFRESH_EXPIRES_IN,
    });

    const refreshHash = await hash(refreshToken);
    await this.authRepository.createRefreshToken({
      userId: user.id,
      tokenHash: refreshHash,
      expiredAt: refreshTTL,
    });

    return { accessToken, refreshToken };
  }
}
