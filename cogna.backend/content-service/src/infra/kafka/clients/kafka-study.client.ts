import { KafkaBaseClient } from './kafka-base.client';
import { DeleteSubjectProgressEvent } from '@cogna-edu/contracts/gen/events/study/subject_progress';

export class KafkaStudyClient extends KafkaBaseClient {
  public async deleteSubjectProgress(dto: DeleteSubjectProgressEvent) {
    return this.emit('study.delete.subject.progress', dto);
  }
}
