import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles_key';

export enum ROLES_ENUM {
  ADMIN = 'admin',
  USER = 'user',
}

export const Roles = (...roles: ROLES_ENUM[]) => SetMetadata(ROLES_KEY, roles);
