import { Injectable, Scope } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import type { TicketAttempt } from '@cogna-edu/contracts/gen/study/ticket-attempt';
import { firstValueFrom } from 'rxjs';
import { TicketAttemptService } from './ticket-attempt.service';

function ticketAttemptKey(userId: string, ticketId: string) {
  return `${userId}:${ticketId}`;
}

@Injectable({ scope: Scope.REQUEST })
export class TicketAttemptLoadersService {
  readonly byUserAndContentTicket: DataLoader<string, TicketAttempt[]>;

  constructor(
    private readonly ticketAttempt: TicketAttemptService,
  ) {
    this.byUserAndContentTicket = new DataLoader<string, TicketAttempt[]>(
      async (keys) => {
        const userIds = new Set(
          keys.map((k) => {
            const i = k.indexOf(':');
            return k.slice(0, i);
          }),
        );
        if (userIds.size !== 1) {
          throw new Error(
            `Expected single userId in ticket attempt batch, got: ${[...userIds].join(', ')}`,
          );
        }
        const userId = [...userIds][0];
        const uniqueKeys = [...new Set(keys)];

        const byKey = new Map<string, TicketAttempt[]>();
        await Promise.all(
          uniqueKeys.map(async (k) => {
            const ticketId = k.slice(k.indexOf(':') + 1);
            const res = await firstValueFrom(
              this.ticketAttempt.batchByTicketProgress({
                userId,
                ticketProgressIds: ticketId,
              }),
            );
            byKey.set(k, res.ticketsAttempts ?? []);
          }),
        );

        return keys.map((k) => byKey.get(k) ?? []);
      },
    );
  }

  loadAttemptsForTicketProgress(
    userId: string,
    contentTicketId: string,
  ): Promise<TicketAttempt[]> {
    return this.byUserAndContentTicket.load(
      ticketAttemptKey(userId, contentTicketId),
    );
  }
}
