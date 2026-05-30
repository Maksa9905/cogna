import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import { HttpsProxyAgent } from 'https-proxy-agent';

@Injectable()
export class GroqService {
  private _groq: Groq;

  constructor(private readonly configService: ConfigService) {
    const proxyUrl = configService.getOrThrow<string>('PROXY_URL');
    const apiKey = configService.getOrThrow<string>('GROQ_API_KEY');
    const agent = new HttpsProxyAgent(proxyUrl);

    this._groq = new Groq({
      apiKey,
      httpAgent: agent,
    });
  }

  get client(): Groq {
    return this._groq;
  }
}
