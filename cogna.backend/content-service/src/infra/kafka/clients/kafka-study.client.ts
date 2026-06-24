import { KafkaBaseClient } from './kafka-base.client';

export type DeleteSubjectProgressEvent = {
  id: string;
  userId: string;
};

export class KafkaStudyClient extends KafkaBaseClient {
  public async deleteSubjectProgress(dto: DeleteSubjectProgressEvent) {
    return this.emit('study.delete.subject.progress', dto);
  }
}
