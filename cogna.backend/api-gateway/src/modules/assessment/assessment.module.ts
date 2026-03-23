import {Module} from '@nestjs/common';
import {AssessmentService} from './assessment.service';
import {AssessmentResolver} from './assessment.resolver';
import {ClientsModule, KafkaOptions, Transport} from "@nestjs/microservices";
import {ConfigModule, ConfigService} from "@nestjs/config";

@Module({
    imports: [ClientsModule.registerAsync([
        {
            name: 'ASSESSMENT_KAFKA_CLIENT',
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService): KafkaOptions => ({
                transport: Transport.KAFKA,
                options: {
                    producerOnlyMode: true,
                    client: {
                        clientId: 'ASSESSMENT_CLIENT',
                        brokers: config.getOrThrow<string>('KAFKA_BROKERS').split(',')
                    },
                    producer: {
                        allowAutoTopicCreation: true,
                        retry: {
                            retries: 5
                        },
                    },
                    run: {
                        autoCommit: false,
                    },
                }
            })
        }
    ])],
    providers: [AssessmentResolver, AssessmentService],
})
export class AssessmentModule {
}
