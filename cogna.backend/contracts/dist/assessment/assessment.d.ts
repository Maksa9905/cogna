import { Observable } from "rxjs";
export declare const protobufPackage = "assessment.v1";
export interface ProcessRequest {
    answer: string;
    userId: string;
    ticketId: string;
}
export interface ProcessResponse {
    success: boolean;
}
export declare const ASSESSMENT_V1_PACKAGE_NAME = "assessment.v1";
export interface AssessmentServiceClient {
    processTranscription(request: ProcessRequest): Observable<ProcessResponse>;
}
export interface AssessmentServiceController {
    processTranscription(request: ProcessRequest): Promise<ProcessResponse> | Observable<ProcessResponse> | ProcessResponse;
}
export declare function AssessmentServiceControllerMethods(): (constructor: Function) => void;
export declare const ASSESSMENT_SERVICE_NAME = "AssessmentService";
