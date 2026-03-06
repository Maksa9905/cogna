import { Observable } from "rxjs";
export declare const protobufPackage = "auth.v1";
/** Jwt */
export interface JwtPayload {
    sub: string;
    refreshTokenId: string;
}
export interface JwtResponse {
    accessToken: string;
    refreshToken: string;
}
/** Success */
export interface SuccessResponse {
    ok: boolean;
}
/** Register */
export interface RegisterRequest {
    email: string;
    password: string;
}
/** Confirm register */
export interface ConfirmRegisterRequest {
    email: string;
    otp: number;
}
/** Login */
export interface LoginRequest {
    email: string;
    password: string;
}
export declare const AUTH_V1_PACKAGE_NAME = "auth.v1";
export interface AuthServiceClient {
    register(request: RegisterRequest): Observable<SuccessResponse>;
    confirmRegister(request: ConfirmRegisterRequest): Observable<JwtResponse>;
    login(request: LoginRequest): Observable<JwtResponse>;
    logout(request: JwtPayload): Observable<SuccessResponse>;
    refreshTokens(request: JwtPayload): Observable<JwtResponse>;
    validateToken(request: JwtPayload): Observable<SuccessResponse>;
}
export interface AuthServiceController {
    register(request: RegisterRequest): Promise<SuccessResponse> | Observable<SuccessResponse> | SuccessResponse;
    confirmRegister(request: ConfirmRegisterRequest): Promise<JwtResponse> | Observable<JwtResponse> | JwtResponse;
    login(request: LoginRequest): Promise<JwtResponse> | Observable<JwtResponse> | JwtResponse;
    logout(request: JwtPayload): Promise<SuccessResponse> | Observable<SuccessResponse> | SuccessResponse;
    refreshTokens(request: JwtPayload): Promise<JwtResponse> | Observable<JwtResponse> | JwtResponse;
    validateToken(request: JwtPayload): Promise<SuccessResponse> | Observable<SuccessResponse> | SuccessResponse;
}
export declare function AuthServiceControllerMethods(): (constructor: Function) => void;
export declare const AUTH_SERVICE_NAME = "AuthService";
