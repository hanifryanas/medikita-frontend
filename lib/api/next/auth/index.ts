import { hydrateAuth } from './hydrate-auth';
import { signinAuth } from './signin-auth';
import { signoutAuth } from './signout-auth';
import { signupAuth } from './signup-auth';

export const authNextApi = {
  signin: signinAuth,
  signup: signupAuth,
  signout: signoutAuth,
  hydrate: hydrateAuth,
};
