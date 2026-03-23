import {Args, Context, Mutation, Resolver} from '@nestjs/graphql';
import {AssessmentService} from './assessment.service';
import {ProcessResponseGql} from "./dto/responses";
import {Request} from "express";
import {ProcessRequestGql} from "./dto/requests";
import {Protected} from "../../common/decorators/protected.decorator";
import {UserRole} from "@cogna-edu/corn";

@Protected(UserRole.USER)
@Resolver()
export class AssessmentResolver {
    constructor(private readonly assessmentService: AssessmentService) {
    }

    @Mutation(() => ProcessResponseGql)
    public async textAnswerAssessment(@Context('req') req: Request, @Args('data') data: ProcessRequestGql): Promise<ProcessResponseGql> {
        return this.assessmentService.processAssessment({...data, userId: req.user.sub})
    }

}
