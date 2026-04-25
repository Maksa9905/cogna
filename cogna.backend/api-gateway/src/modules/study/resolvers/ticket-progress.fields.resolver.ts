import { Injectable, Scope } from '@nestjs/common';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Protected } from '../../../common/decorators/protected.decorator';
import { UserRole } from '@cogna-edu/corn';
import { TicketAttemptGql, TicketProgressGql } from '../dto';
import { TicketAttemptLoadersService } from '../services/ticket-attempt-loaders.service';

@Protected(UserRole.USER)
@Injectable({ scope: Scope.REQUEST })
@Resolver(() => TicketProgressGql)
export class TicketProgressFieldsResolver {
  constructor(
    private readonly ticketAttemptLoaders: TicketAttemptLoadersService,
  ) {}

  @ResolveField('ticketAttempts', () => [TicketAttemptGql])
  ticketAttempts(@Parent() parent: TicketProgressGql) {
    return this.ticketAttemptLoaders.loadAttemptsForTicketProgress(
      parent.userId,
      parent.ticketId,
    );
  }
}
