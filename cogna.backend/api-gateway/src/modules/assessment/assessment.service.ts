import {Inject, Injectable} from '@nestjs/common';
import {ClientKafka} from "@nestjs/microservices";
import {ProcessRequest, ProcessResponse} from "@cogna-edu/contracts/gen/assessment/assessment";
import {firstValueFrom} from "rxjs";

@Injectable()
export class AssessmentService {
    constructor(@Inject('ASSESSMENT_KAFKA_CLIENT') private readonly clientAssessment: ClientKafka) {
    }

    public async processAssessment(dto: ProcessRequest): Promise<ProcessResponse> {
        await firstValueFrom(this.clientAssessment.emit('assessment.process', dto))
        return {success: true}
    }
}
