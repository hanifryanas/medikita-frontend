import { authNextApi } from './auth';
import { departmentsNextApi } from './departments';
import { doctorsNextApi } from './doctors';

export const nextApi = {
  auth: authNextApi,
  departments: departmentsNextApi,
  doctors: doctorsNextApi,
};
