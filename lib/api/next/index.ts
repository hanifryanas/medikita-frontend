import { hydrateAuth, logoutAuth, submitLogin } from '../auth';
import { LoginPayload } from '../../types/auth';

export const nextApi = {
  auth: {
    login: (payload: LoginPayload) => submitLogin(payload),
    logout: () => logoutAuth(),
    hydrate: () => hydrateAuth(),
  },
};
