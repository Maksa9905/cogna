import { Protected } from '../../../common/decorators/protected.decorator';
import { UserRole } from '@cogna-edu/corn';
import { Args, Context, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { TicketProgressService } from '../services/ticket-progress.service';
import { Request } from 'express';
import {
  FindAllTicketsProgressRequestGql,
  FindAllTicketsProgressResponseGql,
  FindDueTicketsProgressRequestGql,
  FindDueTicketsProgressResponseGql,
  FindOneTicketProgressRequestGql,
  FindOneTicketProgressResponseGql,
} from '../dto';

@Protected(UserRole.USER)
@Resolver()
export class TicketProgressResolver {
  constructor(private readonly ticketProgressService: TicketProgressService) {}

  @Query(() => FindOneTicketProgressResponseGql)
  public ticketProgressFindOne(
    @Context('req') req: Request,
    @Args('data') data: FindOneTicketProgressRequestGql,
  ) {
    return this.ticketProgressService.findOne({
      userId: req.user.sub,
      subjectId: data.subjectId,
      ticketId: data.ticketId,
    });
  }

  @Query(() => FindAllTicketsProgressResponseGql)
  public ticketProgressFindAll(
    @Context('req') req: Request,
    @Args('data') data: FindAllTicketsProgressRequestGql,
  ) {
    return this.ticketProgressService.findAll({
      userId: req.user.sub,
      subjectId: data.subjectId,
    });
  }

  @Query(() => FindDueTicketsProgressResponseGql)
  public ticketProgressFindDue(
    @Context('req') req: Request,
    @Args('data') data: FindDueTicketsProgressRequestGql,
  ) {
    return this.ticketProgressService.findDueTicketsProgress({
      userId: req.user.sub,
      subjectId: data.subjectId,
      limit: data.limit,
      offset: data.offset,
    });
  }
}
