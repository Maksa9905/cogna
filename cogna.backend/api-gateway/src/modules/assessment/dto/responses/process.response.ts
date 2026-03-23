import {ProcessResponse} from "@cogna-edu/contracts/dist/assessment/assessment";
import {Field} from "@nestjs/graphql";

export class ProcessResponseGql implements ProcessResponse {
    @Field()
    success: Boolean
}