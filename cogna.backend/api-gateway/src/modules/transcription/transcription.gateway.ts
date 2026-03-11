import { WebSocketGateway } from '@nestjs/websockets';
import { TranscriptionService } from './transcription.service';

@WebSocketGateway()
export class TranscriptionGateway {
  constructor(private readonly transcriptionService: TranscriptionService) {}
}
