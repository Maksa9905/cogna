import 'express';
import { UserRole } from '@cogna-edu/contracts/gen/auth/auth';

declare module 'express' {
  interface Request {
    user: {
      sub: string;
      refreshTokenId: string;
      role: UserRole;
    };
  }
}
