export const registerUserMutationDocument = `
  mutation Mutation($data: RegisterRequestGql!) {
    register(data: $data) {
      ok,
    }
}
`;

export const confirmCodeMutationDocument = `
  mutation Mutation($data: ConfirmRegisterRequestGql!) {
    confirmRegister(data: $data) {
      refreshToken,
      accessToken,
    }
  }
`;

export const loginMutationDocument = `
  mutation Login($data: LoginRequestGql!) {
    login(data: $data) {
      accessToken
      refreshToken
    }
  }
`;

export const logoutMutationDocument = `
  mutation Logout {
    logout {
      ok
    }
  }
`;
