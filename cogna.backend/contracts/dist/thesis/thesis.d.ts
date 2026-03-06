import { Observable } from "rxjs";
export declare const protobufPackage = "thesis.v1";
export interface Thesis {
    value: string;
    importance: string;
}
export interface GenerateThesesRequest {
    question: string;
    answer: string;
}
export interface ThesisStreamChunk {
    content: string;
    done: string;
}
export interface GenerateThesesResponse {
    theses: Thesis[];
}
export declare const THESIS_V1_PACKAGE_NAME = "thesis.v1";
export interface ThesisServiceClient {
    createThesis(request: GenerateThesesRequest): Observable<ThesisStreamChunk>;
}
export interface ThesisServiceController {
    createThesis(request: GenerateThesesRequest): Observable<ThesisStreamChunk>;
}
export declare function ThesisServiceControllerMethods(): (constructor: Function) => void;
export declare const THESIS_SERVICE_NAME = "ThesisService";
