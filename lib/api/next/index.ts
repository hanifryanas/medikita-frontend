import { hydrateAuth, signoutAuth, submitSignin } from '../auth';
import { SigninPayload } from '../../types/auth';

export const nextApi = {
  auth: {
    signin: (payload: SigninPayload) => submitSignin(payload),
    signout: () => signoutAuth(),
    hydrate: () => hydrateAuth(),
  },
};
