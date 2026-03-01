<script setup lang="ts">
import {
	useConfirmRegisterMutation,
	useRegisterMutation,
} from "@/entities/user";
import { useSession } from "@/entities/session";
import {
	AuthDescription,
	AuthIntergrations,
	AuthSeparator,
	AuthTitle,
	SignUpForm,
	ConfirmCodeForm,
	useAuthErrorHandler,
	type ConfirmCodeFormValues,
	type SignUpFormValues,
} from "@/features/auth";
import { localizedRoutes } from "@/shared/router/routes";
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import type { SupportedLocale } from "@/shared/i18n";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const { saveTokens } = useSession();
const { handleError } = useAuthErrorHandler();

const {
	mutateAsync: register,
	isPending: isRegisterPending,
	isSuccess: isRegisterSuccess,
} = useRegisterMutation();
const { mutateAsync: confirmCode, isPending: isConfirmPending } =
	useConfirmRegisterMutation();

const registeredEmail = ref("");

const handleSubmitForm = async (payload: SignUpFormValues) => {
	const email = payload.email;
	const password = payload.password;

	if (!email || !password) return;

	try {
		const result = await register({ email, password });
		if (result.register.ok && payload.email) {
			registeredEmail.value = payload.email;
		}
	} catch (error) {
		handleError(error);
	}
};

const handleConfirmCode = async (payload: ConfirmCodeFormValues) => {
	try {
		const result = await confirmCode({
			otp: parseInt(payload.code),
			email: registeredEmail.value,
		});

		saveTokens(
			result.confirmRegister.accessToken,
			result.confirmRegister.refreshToken,
		);
		const locale = route.params.locale as SupportedLocale;
		await router.push(localizedRoutes(locale).home);
	} catch (error) {
		handleError(error);
	}
};
</script>

<template>
	<div v-if="isRegisterSuccess" class="signup-page">
		<AuthTitle>{{ t('auth.confirm.title') }}</AuthTitle>
		<AuthDescription>{{ t('auth.confirm.description') }} <span class="highlighted">{{
			registeredEmail }}</span></AuthDescription>
		<ConfirmCodeForm :is-loading="isConfirmPending" class="confirm-code-form" :email="registeredEmail"
			@confirm="handleConfirmCode" />
	</div>
	<div v-else class="signup-page">
		<AuthTitle>{{ t('auth.signup.title') }}</AuthTitle>
		<AuthDescription>{{ t('auth.signup.description') }}</AuthDescription>
		<AuthIntergrations />
		<AuthSeparator />
		<SignUpForm :is-loading="isRegisterPending" @submit="handleSubmitForm" />
	</div>
</template>

<style>
.signup-page {
	padding: 40px 0;
	display: flex;
	flex: 1;
	flex-direction: column;
	justify-content: center;
}

.confirm-code-form {
	margin-top: 24px;
}

.highlighted {
	color: var(--color-primary);
	font-weight: 600;
}
</style>
