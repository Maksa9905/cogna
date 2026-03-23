import { Observable } from "rxjs";
import { Empty } from "../google/protobuf/empty";
export declare const protobufPackage = "assessment.v1";
export interface ProcessRequest {
    answer: string;
    userId: string;
    ticketId: string;
}
export declare const ASSESSMENT_V1_PACKAGE_NAME = "assessment.v1";
export interface AssessmentServiceClient {
    processTranscription(request: ProcessRequest): Observable<Empty>;
}
export interface AssessmentServiceController {
    processTranscription(request: ProcessRequest): void | Promise<void>;
}
export declare function AssessmentServiceControllerMethods(): (constructor: Function) => void;
export declare const ASSESSMENT_SERVICE_NAME = "AssessmentService";
