import { Controller } from '@nestjs/common';
import { ThesisService } from './thesis.service';
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
export class ThesisController implements ThesisServiceController {
  constructor(private readonly thesisService: ThesisService) {}

  public createThesis(request: GenerateThesesRequest) {
    console.log('!!!');
    return this.thesisService.generateThesis(request);
  }

  public generateAnswer(request: GenerateAnswerRequest) {
    return this.thesisService.generateAnswer(request);
  }
}
