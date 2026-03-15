import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Groq } from 'groq-sdk';
import { HttpsProxyAgent } from 'https-proxy-agent';
import {
  TranscriptionRequest,
  TranscriptionResponse,
} from '@cogna-edu/contracts/gen/transcription/transcription';

@Injectable()
export class TranscriptionService {
  private readonly logger = new Logger(TranscriptionService.name);
  private readonly agent: HttpsProxyAgent<string>;
  private groq: Groq;

  constructor(private readonly configService: ConfigService) {
    const proxyUser = this.configService.getOrThrow<string>('PROXY_USER');
    const proxyPassword =
      this.configService.getOrThrow<string>('PROXY_PASSWORD');
    const proxyUrl = this.configService.getOrThrow<string>('PROXY_URL');
    const apiKey = this.configService.getOrThrow<string>('GROQ_API_KEY');

    const cleanUrl = proxyUrl.replace(/^"|"$/g, '');
    const urlObj = new URL(cleanUrl);

    this.agent = new HttpsProxyAgent(
      `http://${proxyUser}:${proxyPassword}@${urlObj.host}`,
    );

    this.groq = new Groq({
      apiKey: apiKey,
      httpAgent: this.agent,
    });

    this.logger.log('AppService инициализирован');
  }

  public async transcribe(bufferFile: Buffer): Promise<string> {
    console.log('start transcription...');
    const response = await this.groq.audio.transcriptions.create({
      model: 'whisper-large-v3-turbo',
      file: await Groq.toFile(bufferFile, 'audio.mp3'),
      response_format: 'verbose_json',
      language: 'ru',
    });
    console.log(response);
    return response.text;
  }
}
