import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  CreateSubjectRequestGql,
  DeleteSubjectRequestGql,
  FindAllSubjectsRequestGql,
  FindAllSubjectsResponseGql,
  FindOneSubjectRequestGql,
  SubjectGql,
  SubjectResponseGql,
  SuccessResponseContentGql,
  TicketGql,
  UpdateSubjectRequestGql,
} from '../dto';
import { SubjectService } from '../services/subject.service';
import { Request } from 'express';
import { Protected } from '../../../common/decorators/protected.decorator';
import { UserRole } from '@cogna-edu/corn';
import { TicketService } from '../services/ticket.service';
import { SubjectProgressGql } from '../../study/dto';
import { SubjectProgressService } from '../../study/services/subject-progress.service';
import { firstValueFrom } from 'rxjs';

@Protected(UserRole.USER)
@Resolver(() => SubjectGql)
export class SubjectResolver {
  constructor(
    private readonly subjectService: SubjectService,
    private readonly ticketService: TicketService,
    private readonly subjectProgressService: SubjectProgressService,
  ) {}

  // @ResolveField(() => [TicketGql])
  // public tickets(@Parent() subject: SubjectGql): TicketGql[] {}

  @Mutation(() => SubjectResponseGql)
  public async subjectCreateSubject(
    @Context('req') req: Request,
    @Args('data') dto: CreateSubjectRequestGql,
  ) {
    return await this.subjectService.createSubject({
      userId: req.user.sub,
      ...dto,
    });
  }

  @Query(() => SubjectResponseGql)
  public async subjectFindOne(
    @Context('req') req: Request,
    @Args('data') dto: FindOneSubjectRequestGql,
  ) {
    return await this.subjectService.findOneSubject({
      userId: req.user.sub,
      id: dto.id,
    });
  }

  @Query(() => FindAllSubjectsResponseGql)
  public async subjectFindAll(
    @Context('req') req: Request,
    @Args('data') dto: FindAllSubjectsRequestGql,
  ) {
    return await this.subjectService.findAllSubjects({
      ...dto,
      userId: req.user.sub,
    });
  }

  @Mutation(() => SubjectResponseGql)
  public async subjectUpdateSubject(
    @Context('req') req: Request,
    @Args('data') dto: UpdateSubjectRequestGql,
  ) {
    return await this.subjectService.updateSubject({
      userId: req.user.sub,
      ...dto,
    });
  }

  @Mutation(() => SuccessResponseContentGql)
  public async subjectDeleteSubject(
    @Context('req') req: Request,
    @Args('data') dto: DeleteSubjectRequestGql,
  ) {
    return await this.subjectService.deleteSubject({
      userId: req.user.sub,
      ...dto,
    });
  }

  @ResolveField(() => [TicketGql])
  public async tickets(@Parent() subject: SubjectGql) {
    const { id } = subject;
    const response = await this.ticketService.findAllTickets({ subjectId: id });
    return response.tickets;
  }

  @ResolveField(() => SubjectProgressGql, { nullable: true })
  public async subjectProgress(@Parent() subject: SubjectGql) {
    const result = await firstValueFrom(
      this.subjectProgressService.findOne({
        subjectId: subject.id,
        userId: subject.userId,
      }),
    );
    return result.subjectProgress ?? null;
  }
}
