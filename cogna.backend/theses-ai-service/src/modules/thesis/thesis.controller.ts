import { Controller } from '@nestjs/common';
import { ThesisService } from './thesis.service';
import {
  ThesisServiceController,
  ThesisServiceControllerMethods,
} from '@cogna-edu/contracts/dist/thesis/thesis';
import {
  GenerateThesesRequest,
} from '@cogna-edu/contracts/gen/thesis/thesis';

@Controller('thesis')
@ThesisServiceControllerMethods()
export class ThesisController implements ThesisServiceController {
  constructor(private readonly thesisService: ThesisService) {}

  public createThesis(request: GenerateThesesRequest) {
    return this.thesisService.generateThesis(request);
  }
}
