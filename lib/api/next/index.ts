import { SigninPayload, SignupPayload } from '../../types/auth';
import { hydrateAuth, signinAuth, signoutAuth, signupAuth } from '../auth';

export const nextApi = {
  auth: {
    signin: signinAuth,
    signup: signupAuth,
    signout: signoutAuth,
    hydrate: hydrateAuth,
  },
};
