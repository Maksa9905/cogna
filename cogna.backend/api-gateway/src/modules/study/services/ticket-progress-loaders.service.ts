import { Injectable, Scope } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { firstValueFrom } from 'rxjs';
import type { TicketProgress } from '@cogna-edu/contracts/gen/study/ticket-progress';
import { TicketProgressService } from './ticket-progress.service';

function ticketProgressKey(userId: string, subjectId: string) {
  return `${userId}:${subjectId}`;
}

@Injectable({ scope: Scope.REQUEST })
export class TicketProgressLoadersService {
  readonly byUserAndSubject: DataLoader<string, TicketProgress[]>;

  constructor(private readonly ticketProgress: TicketProgressService) {
    this.byUserAndSubject = new DataLoader<string, TicketProgress[]>(
      async (keys) => {
        const pairs = keys.map((k) => {
          const [userId, subjectId] = k.split(':');
          return { userId, subjectId };
        });

        const userIds = [...new Set(pairs.map((p) => p.userId))];
        if (userIds.length !== 1) {
          throw new Error(
            `Expected single userId in ticket progress batch, got: ${userIds.join(', ')}`,
          );
        }

        const userId = userIds[0];
        const subjectIds = [...new Set(pairs.map((p) => p.subjectId))];

        const res = await firstValueFrom(
          this.ticketProgress.batchBySubjects({ userId, subjectIds }),
        );

        const grouped = new Map<string, TicketProgress[]>();
        for (const row of res.ticketsProgress ?? []) {
          const mapKey = ticketProgressKey(row.userId, row.subjectId);
          const arr = grouped.get(mapKey) ?? [];
          arr.push(row);
          grouped.set(mapKey, arr);
        }

        return keys.map((k) => grouped.get(k) ?? []);
      },
    );
  }

  loadTicketsForSubject(userId: string, subjectId: string) {
    return this.byUserAndSubject.load(ticketProgressKey(userId, subjectId));
  }
}
