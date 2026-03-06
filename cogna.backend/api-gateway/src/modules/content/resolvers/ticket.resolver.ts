import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateTicketRequestGql,
  DeleteTicketRequestGql,
  FindAllTicketsRequestGql,
  FindAllTicketsResponseGql,
  FindOneTicketRequestGql,
  GenerateThesesRequestGql,
  SuccessResponseContentGql,
  TicketResponseGql,
  UpdateTicketRequestGql,
} from '../dto';
import { TicketService } from '../services/ticket.service';
import { Request } from 'express';
import { Protected } from '../../../common/decorators/protected.decorator';
import { UserRole } from '@cogna-edu/corn';

@Protected(UserRole.USER)
@Resolver()
export class TicketResolver {
  constructor(private readonly ticketService: TicketService) {}

  //todo подумать о том что пользователь сразу сам сможет написать тезисы и тогда их надо сохранить вмесет с новым обькектом
  @Mutation(() => TicketResponseGql)
  public async ticketCreateTicket(@Args('data') dto: CreateTicketRequestGql) {
    return await this.ticketService.createTicket(dto);
  }

  @Query(() => TicketResponseGql)
  public async ticketFindOneTicket(
    @Context('req') req: Request,
    @Args('data') dto: FindOneTicketRequestGql,
  ) {
    return await this.ticketService.findOneTicket({
      userId: req.user.sub,
      ...dto,
    });
  }

  //todo передавать еще userId
  @Query(() => FindAllTicketsResponseGql)
  public async ticketFindAllTickets(
    @Args('data') dto: FindAllTicketsRequestGql,
  ) {
    return await this.ticketService.findAllTickets(dto);
  }

  //todo подумать о patch и Сохранение новых тезисов
  @Mutation(() => TicketResponseGql)
  public async ticketUpdateTicket(
    @Context('req') req: Request,
    @Args('data') dto: UpdateTicketRequestGql,
  ) {
    return await this.ticketService.updateTicket({
      userId: req.user.sub,
      ...dto,
    });
  }

  @Mutation(() => SuccessResponseContentGql)
  public async ticketDeleteTicket(
    @Context('req') req: Request,
    @Args('data') dto: DeleteTicketRequestGql,
  ) {
    return await this.ticketService.deleteTicket({
      userId: req.user.sub,
      ...dto,
    });
  }

  @Mutation(() => TicketResponseGql)
  public async ticketGenerateTheses(
    @Args('data') dto: GenerateThesesRequestGql,
  ) {
    return await this.ticketService.generateTheses(dto);
  }
}
