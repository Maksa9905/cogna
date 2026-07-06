import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Protected } from '../../../common/decorators/protected.decorator';
import { UserRole } from '@cogna-edu/corn';
import {
  CreateQuizRequestGql,
  CreateQuizResponseGql,
  DeleteQuizRequestGql,
  FindAllQuizzesBySubjectIdRequestGql,
  FindAllQuizzesBySubjectIdResponseGql,
  GenerateQuizRequestGql,
  GenerateQuizResponseGql,
  GetQuizRequestGql,
  PatchQuizRequestGql,
  QuizResponseGql,
  SuccessResponseContentGql,
} from '../dto';
import { QuizService } from '../services/quiz.service';

@Protected(UserRole.USER)
@Resolver()
export class QuizResolver {
  constructor(private readonly quizService: QuizService) {}

  @Mutation(() => CreateQuizResponseGql)
  public quizCreate(@Args('data') dto: CreateQuizRequestGql) {
    return this.quizService.createQuiz(dto);
  }

  @Mutation(() => GenerateQuizResponseGql)
  public quizGenerate(@Args('data') dto: GenerateQuizRequestGql) {
    return this.quizService.generateQuiz(dto);
  }

  @Query(() => QuizResponseGql)
  public quizGet(@Args('data') dto: GetQuizRequestGql) {
    return this.quizService.getQuiz(dto);
  }

  @Mutation(() => QuizResponseGql)
  public quizPatch(@Args('data') dto: PatchQuizRequestGql) {
    return this.quizService.patchQuiz({
      ...dto,
      answerOptions: dto.answerOptions && { items: dto.answerOptions },
    });
  }

  @Mutation(() => SuccessResponseContentGql)
  public quizDelete(@Args('data') dto: DeleteQuizRequestGql) {
    return this.quizService.deleteQuiz(dto);
  }

  @Query(() => FindAllQuizzesBySubjectIdResponseGql)
  public quizFindAllBySubjectId(
    @Args('data') dto: FindAllQuizzesBySubjectIdRequestGql,
  ) {
    return this.quizService.findAllQuizzesBySubjectId(dto);
  }
}
