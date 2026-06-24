import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import {
  CreateTicketRequestGql,
  DeleteTicketRequestGql,
  FindAllTicketsRequestGql,
  FindAllTicketsResponseGql,
  FindOneTicketRequestGql,
  GenerateAnswerRequestGql,
  GenerateAnswerResponseGql,
  GenerateThesesRequestGql,
  SuccessResponseContentGql,
  TicketResponseGql,
  PatchTicketRequestGql,
  QuizGql,
  TicketGql,
} from '../dto';
import { TicketService } from '../services/ticket.service';
import { Protected } from '../../../common/decorators/protected.decorator';
import { UserRole } from '@cogna-edu/corn';
import { PubSub } from 'graphql-subscriptions';
import { interval, map, take } from 'rxjs';
import { QuizService } from '../services/quiz.service';

export type PubSubEvents = {
  TEST_STREAM_1: { testStream: string };
  [key: string]: any;
};

const pubSub = new PubSub();

@Protected(UserRole.USER)
@Resolver(() => TicketGql)
export class TicketResolver {
  constructor(
    private readonly ticketService: TicketService,
    private readonly quizService: QuizService,
  ) {}

  @Mutation(() => TicketResponseGql)
  public async ticketCreateTicket(@Args('data') dto: CreateTicketRequestGql) {
    return await this.ticketService.createTicket(dto);
  }

  @Query(() => TicketResponseGql)
  public async ticketFindOneTicket(@Args('data') dto: FindOneTicketRequestGql) {
    return await this.ticketService.findOneTicket(dto);
  }

  @Query(() => FindAllTicketsResponseGql)
  public async ticketFindAllTickets(
    @Args('data') dto: FindAllTicketsRequestGql,
  ) {
    return await this.ticketService.findAllTickets(dto);
  }

  @Mutation(() => TicketResponseGql)
  public async ticketPatchTicket(@Args('data') dto: PatchTicketRequestGql) {
    return await this.ticketService.patchTicket({
      ...dto,
      theses: dto.theses && { items: dto.theses },
    });
  }

  @Mutation(() => SuccessResponseContentGql)
  public async ticketDeleteTicket(@Args('data') dto: DeleteTicketRequestGql) {
    return await this.ticketService.deleteTicket(dto);
  }

  @Mutation(() => TicketResponseGql)
  public async ticketGenerateTheses(
    @Args('data') dto: GenerateThesesRequestGql,
  ) {
    return await this.ticketService.generateTheses(dto);
  }

  @Mutation(() => GenerateAnswerResponseGql)
  public async ticketGenerateAnswer(
    @Args('data') dto: GenerateAnswerRequestGql,
  ) {
    return await this.ticketService.generateAnswer(dto);
  }

  @ResolveField(() => [QuizGql])
  public async quizzes(@Parent() ticket: TicketGql) {
    const response = await this.quizService.findAllQuizzesByTicketId({
      ticketId: ticket.id,
    });
    return response.quizzes;
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
