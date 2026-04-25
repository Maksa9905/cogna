import { SubjectGql, SubjectResponseGql } from '../dto';
import { Protected } from '../../../common/decorators/protected.decorator';
import { UserRole } from '@cogna-edu/corn';
import { SubjectService } from '../services/subject.service';
import { SubjectProgressService } from '../../study/services/subject-progress.service';
import { TicketService } from '../services/ticket.service';
import { TicketProgressLoadersService } from '../../study/services/ticket-progress-loaders.service';
import { Field, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { SubjectProgressEntity, SubjectProgressGql } from '../../study/dto';

@Protected(UserRole.USER)
@Resolver(() => SubjectResponseGql)
export class subjectFieldResolver {
  constructor(
    private readonly subjectProgressService: SubjectProgressService,
    private readonly ticketProgressLoadersService: TicketProgressLoadersService,
  ) {}

  @ResolveField('subjectProgress', () => SubjectProgressGql)
  subjectProgress(@Parent() parent: SubjectResponseGql) {
    return this.subjectProgressService.findOne({
      subjectId: parent.subject.id,
      userId: parent.subject.userId,
    });
  }
}
