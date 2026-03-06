import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtGuard, RolesGuard } from '../guards';
import { Roles } from './roles.decorator';
import { UserRole } from '@cogna-edu/corn/dist/enum';


export const Protected = (...roles: UserRole[]) =>
  applyDecorators(UseGuards(JwtGuard, RolesGuard), Roles(...roles));
