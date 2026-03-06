import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ThesisService } from './thesis.service';
import { GenerateThesisResponseGql } from './dto/responses/generate-thesis.response';
import { GenerateThesisRequestGql } from './dto/requests/generate-thesis.request';

@Resolver()
export class ThesisResolver {
  constructor(private readonly thesisService: ThesisService) {}

  @Mutation(() => GenerateThesisResponseGql)
  public async generateTheses(@Args('data') dto: GenerateThesisRequestGql) {
    return this.thesisService.generateTheses(dto);
  }
}
