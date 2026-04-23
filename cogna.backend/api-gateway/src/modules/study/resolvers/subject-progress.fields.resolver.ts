import { Injectable, Scope } from '@nestjs/common';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Protected } from '../../../common/decorators/protected.decorator';
import { UserRole } from '@cogna-edu/corn';
import { SubjectProgressGql, TicketProgressGql } from '../dto';
import { TicketProgressLoadersService } from '../services/ticket-progress-loaders.service';

@Protected(UserRole.USER)
@Injectable({ scope: Scope.REQUEST })
@Resolver(() => SubjectProgressGql)
export class SubjectProgressFieldsResolver {
  constructor(
    private readonly ticketProgressLoaders: TicketProgressLoadersService,
  ) {}

  @ResolveField('ticketsProgress', () => [TicketProgressGql])
  ticketsProgress(@Parent() parent: SubjectProgressGql) {
    return this.ticketProgressLoaders.loadTicketsForSubject(
      parent.userId,
      parent.subjectId,
    );
  }
}
