import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../guards';

export const Protected = () => applyDecorators(UseGuards(JwtGuard));
