import { Observable } from "rxjs";
import { Empty } from "./google/protobuf/empty";
export declare const protobufPackage = "notification.v1";
export interface SendOtpRequest {
    email: string;
    otp: number;
}
export declare const NOTIFICATION_V1_PACKAGE_NAME = "notification.v1";
export interface NotificationServiceClient {
    sendOtp(request: SendOtpRequest): Observable<Empty>;
}
export interface NotificationServiceController {
    sendOtp(request: SendOtpRequest): void | Promise<void>;
}
export declare function NotificationServiceControllerMethods(): (constructor: Function) => void;
export declare const NOTIFICATION_SERVICE_NAME = "NotificationService";
