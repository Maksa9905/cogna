import { Global, Module } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';

@Global()
@Module({
  providers: [
    {
      provide: 'ALS',
      useValue: new AsyncLocalStorage<{ userId: string }>(),
    },
  ],
  exports: ['ALS'],
})
export class AlsModule {}
