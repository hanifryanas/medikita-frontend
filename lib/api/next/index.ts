import { SigninPayload, SignupPayload } from '../../types/auth';
import { hydrateAuth, signinAuth, signoutAuth, signupAuth } from '../auth';

export const nextApi = {
  auth: {
    signin: (payload: SigninPayload) => signinAuth(payload),
    signup: (payload: SignupPayload) => signupAuth(payload),
    signout: () => signoutAuth(),
    hydrate: () => hydrateAuth(),
  },
};
