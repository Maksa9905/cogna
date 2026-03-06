import { useMutation } from "@tanstack/vue-query";
import { publicRequest, authRequest } from "@/shared/api";
import type {
	ConfirmRegisterMutationPayload,
	ConfirmRegisterMutationResponse,
	LoginMutationPayload,
	LoginMutationResponse,
	LogoutMutationResponse,
	RegisterMutationPayload,
	RegisterMutationResponse,
} from "./types";
import {
	confirmCodeMutationDocument,
	loginMutationDocument,
	logoutMutationDocument,
	registerUserMutationDocument,
} from "./gpql";

export const useRegisterMutation = () => {
	return useMutation<RegisterMutationResponse, Error, RegisterMutationPayload>({
		mutationFn: (payload) =>
			publicRequest<RegisterMutationResponse>(registerUserMutationDocument, {
				data: { email: payload.email, password: payload.password },
			}),
	});
};

export const useConfirmRegisterMutation = () => {
	return useMutation<ConfirmRegisterMutationResponse, Error, ConfirmRegisterMutationPayload>({
		mutationFn: (payload) =>
			publicRequest<ConfirmRegisterMutationResponse>(confirmCodeMutationDocument, {
				data: { otp: payload.otp, email: payload.email },
			}),
	});
};

export const useLoginMutation = () => {
	return useMutation<LoginMutationResponse, Error, LoginMutationPayload>({
		mutationFn: (payload) =>
			publicRequest<LoginMutationResponse>(loginMutationDocument, {
				data: { email: payload.email, password: payload.password },
			}),
	});
};

export const useLogoutMutation = () => {
	return useMutation<LogoutMutationResponse, Error, void>({
		mutationFn: () => authRequest<LogoutMutationResponse>(logoutMutationDocument),
	});
};
