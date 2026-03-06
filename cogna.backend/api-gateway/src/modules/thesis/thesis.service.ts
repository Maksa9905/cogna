import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  GenerateThesesRequest,
  ThesisServiceClient,
} from '@cogna-edu/contracts/gen/thesis/thesis';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ThesisService {
  private thesisClient: ThesisServiceClient;

  constructor(@Inject('THESIS_CLIENT') private readonly client: ClientGrpc) {
    this.thesisClient = client.getService<ThesisServiceClient>('ThesisService');
  }

  public async generateTheses(dto: GenerateThesesRequest) {
    return await firstValueFrom(this.thesisClient.createThesis(dto));
  }
}
