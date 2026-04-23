import { Observable } from "rxjs";
export declare const protobufPackage = "study.subject.progress.v1";
export interface SubjectProgress {
    id: string;
    subjectId: string;
    userId: string;
    studiedTickets: number;
    averageTicketsScore: number;
    lastRepetitionData: Date | undefined;
    createdAt: Date | undefined;
    updatedAt: Date | undefined;
}
export interface FindOneSubjectProgressRequest {
    subjectId: string;
    userId: string;
}
export interface FindOneSubjectProgressResponse {
    subjectProgress: SubjectProgress | undefined;
}
export interface FindAllSubjectProgressRequest {
    userId: string;
}
export interface FindAllSubjectProgressResponse {
    subjectsProgress: SubjectProgress[];
}
export declare const STUDY_SUBJECT_PROGRESS_V1_PACKAGE_NAME = "study.subject.progress.v1";
export interface StudySubjectProgressServiceClient {
    findOneSubjectProgress(request: FindOneSubjectProgressRequest): Observable<FindOneSubjectProgressResponse>;
    findAllSubjectsProgress(request: FindAllSubjectProgressRequest): Observable<FindAllSubjectProgressResponse>;
}
export interface StudySubjectProgressServiceController {
    findOneSubjectProgress(request: FindOneSubjectProgressRequest): Promise<FindOneSubjectProgressResponse> | Observable<FindOneSubjectProgressResponse> | FindOneSubjectProgressResponse;
    findAllSubjectsProgress(request: FindAllSubjectProgressRequest): Promise<FindAllSubjectProgressResponse> | Observable<FindAllSubjectProgressResponse> | FindAllSubjectProgressResponse;
}
export declare function StudySubjectProgressServiceControllerMethods(): (constructor: Function) => void;
export declare const STUDY_SUBJECT_PROGRESS_SERVICE_NAME = "StudySubjectProgressService";
