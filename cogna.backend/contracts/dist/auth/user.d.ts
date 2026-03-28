import { Observable } from "rxjs";
export declare const protobufPackage = "user.v1";
export interface UserInfoRequest {
    userId: string;
}
export interface UserInfoResponse {
    userId: string;
    email: string;
}
export declare const USER_V1_PACKAGE_NAME = "user.v1";
export interface UserServiceClient {
    getUserInfo(request: UserInfoRequest): Observable<UserInfoResponse>;
}
export interface UserServiceController {
    getUserInfo(request: UserInfoRequest): Promise<UserInfoResponse> | Observable<UserInfoResponse> | UserInfoResponse;
}
export declare function UserServiceControllerMethods(): (constructor: Function) => void;
export declare const USER_SERVICE_NAME = "UserService";
