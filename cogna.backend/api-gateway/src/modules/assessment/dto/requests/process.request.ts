import {Field, InputType} from "@nestjs/graphql";
import {ProcessRequest} from "@cogna-edu/contracts/dist/assessment/assessment";

@InputType()
export class ProcessRequestGql implements Omit<ProcessRequest, 'userId'> {
    @Field()
    answer: string;

    @Field()
    ticketId: string;
}