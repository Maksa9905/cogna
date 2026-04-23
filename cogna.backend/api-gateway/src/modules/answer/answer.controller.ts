import { Controller, Inject } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { AssessmentCompletedResponse } from '@cogna-edu/contracts/gen/assessment/assessment';
import { AssessmentCompletedChannel } from './answer.resolver';

@Controller()
export class AnswerController {
  constructor(@Inject('PUB_SUB') private readonly pubSub: RedisPubSub) {}

  @EventPattern('assessment.completed')
  public async assessmentCompleted(dto: AssessmentCompletedResponse) {
    console.log(dto);
    await this.pubSub.publish(AssessmentCompletedChannel(dto.userId), {
      onAssessmentCompleted: dto,
    });
  }
}
