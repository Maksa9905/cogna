import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { Protected } from '../../../common/decorators/protected.decorator';
import { SubjectProgressService } from '../services/subject-progress.service';
import { UserRole } from '@cogna-edu/corn';
import {
  FindAllSubjectProgressResponseGql,
  FindOneSubjectProgressRequestGql,
  FindOneSubjectProgressResponseGql,
} from '../dto';
import { Request } from 'express';

@Protected(UserRole.USER)
@Resolver()
export class SubjectProgressResolver {
  constructor(
    private readonly subjectProgressService: SubjectProgressService,
  ) {}

  @Query(() => FindOneSubjectProgressResponseGql)
  public subjectProgressFindOne(
    @Context('req') req: Request,
    @Args('data') data: FindOneSubjectProgressRequestGql,
  ) {
    return this.subjectProgressService.findOne({
      userId: req.user.sub,
      subjectId: data.subjectId,
    });
  }

  @Query(() => FindAllSubjectProgressResponseGql)
  public subjectProgressFindAll(@Context('req') req: Request) {
    return this.subjectProgressService.findAll({ userId: req.user.sub });
  }
}
