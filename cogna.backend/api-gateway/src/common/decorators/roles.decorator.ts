import { UserRole } from '@cogna-edu/corn/dist/enum';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles_key';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
