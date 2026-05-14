import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import {
  CreateTicketRequestGql,
  DeleteTicketRequestGql,
  FindAllTicketsRequestGql,
  FindAllTicketsResponseGql,
  FindOneTicketRequestGql,
  GenerateThesesRequestGql,
  SuccessResponseContentGql,
  TicketResponseGql,
  PatchTicketRequestGql,
} from '../dto';
import { TicketService } from '../services/ticket.service';
import { Request } from 'express';
import { Protected } from '../../../common/decorators/protected.decorator';
import { UserRole } from '@cogna-edu/corn';
import { PubSub } from 'graphql-subscriptions';
import { interval, map, take } from 'rxjs';

export type PubSubEvents = {
  TEST_STREAM_1: { testStream: string };
  [key: string]: any; // Для динамических каналов тикетов
};

const pubSub = new PubSub();

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
  public async ticketPatchTicket(
    @Context('req') req: Request,
    @Args('data') dto: PatchTicketRequestGql,
  ) {
    return await this.ticketService.patchTicket({
      userId: req.user.sub,
      ...dto,
      theses: dto.theses && { items: dto.theses },
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

  @Subscription(() => String, {})
  public testStream() {
    const data = [
      'Этот',
      'сервис',
      'будет',
      'быстро',
      'стримить',
      'тезисы',
      'прямо',
      'в',
      'ваш',
      'интерфейс',
    ];
    const stream = interval(1000).pipe(
      take(data.length),
      map((index) => data[index]),
    );

    stream.subscribe({
      next: (data) => {
        console.log(data);
        void pubSub.publish('channel', { testStream: data });
      },
      complete: () => console.log('Поток завершен'),
    });

    return pubSub.asyncIterableIterator('channel');
  }
}
