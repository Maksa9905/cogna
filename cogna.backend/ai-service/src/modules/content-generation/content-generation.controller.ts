import { Controller } from '@nestjs/common';
import { ContentGenerationService } from './content-generation.service';
import {
  ThesisServiceController,
  ThesisServiceControllerMethods,
} from '@cogna-edu/contracts/dist/thesis/thesis';
import {
  GenerateAnswerRequest,
  GenerateThesesRequest,
} from '@cogna-edu/contracts/gen/thesis/thesis';

@Controller('thesis')
@ThesisServiceControllerMethods()
export class ContentGenerationController implements ThesisServiceController {
  constructor(private readonly service: ContentGenerationService) {}

  public createThesis(request: GenerateThesesRequest) {
    return this.service.generateThesis(request);
  }

  public generateAnswer(request: GenerateAnswerRequest) {
    return this.service.generateAnswer(request);
  }
}
