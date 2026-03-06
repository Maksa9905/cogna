import 'express';
import { UserRole } from '@cogna-edu/corn/dist/enum';

declare module 'express' {
  interface Request {
    user: {
      sub: string;
      refreshTokenId: string;
      role: UserRole;
    };
  }
}
