import { KafkaBaseClient } from './kafka-base.client';
import { DeleteSubjectRequest } from '@cogna-edu/contracts/gen/content/subject';

export class KafkaStudyClient extends KafkaBaseClient {
  public async deleteSubjectProgress(dto: DeleteSubjectRequest) {
    return this.emit('study.delete.subject.progress', dto);
  }
}
