import { SigninPayload } from '../../types/auth';
import { hydrateAuth, signinAuth, signoutAuth } from '../auth';

export const nextApi = {
  auth: {
    signin: (payload: SigninPayload) => signinAuth(payload),
    signout: () => signoutAuth(),
    hydrate: () => hydrateAuth(),
  },
};
