import {
  Args,
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

  @Mutation(() => SubjectResponseGql)
  public async subjectCreateSubject(@Args('data') dto: CreateSubjectRequestGql) {
    return await this.subjectService.createSubject(dto);
  }

  @Query(() => SubjectResponseGql)
  public async subjectFindOne(@Args('data') dto: FindOneSubjectRequestGql) {
    return await this.subjectService.findOneSubject(dto);
  }

  @Query(() => FindAllSubjectsResponseGql)
  public async subjectFindAll(@Args('data') dto: FindAllSubjectsRequestGql) {
    return await this.subjectService.findAllSubjects(dto);
  }

  @Mutation(() => SubjectResponseGql)
  public async subjectUpdateSubject(@Args('data') dto: UpdateSubjectRequestGql) {
    return await this.subjectService.updateSubject(dto);
  }

  @Mutation(() => SuccessResponseContentGql)
  public async subjectDeleteSubject(@Args('data') dto: DeleteSubjectRequestGql) {
    return await this.subjectService.deleteSubject(dto);
  }

  @ResolveField(() => [TicketGql])
  public async tickets(@Parent() subject: SubjectGql) {
    const response = await this.ticketService.findAllTickets({
      subjectId: subject.id,
    });
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
