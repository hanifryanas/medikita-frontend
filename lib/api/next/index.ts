import { authNextApi } from './auth';
import { departmentsNextApi } from './departments';
import { doctorsNextApi } from './doctors';
import { nursesNextApi } from './nurses';

export const nextApi = {
  auth: authNextApi,
  departments: departmentsNextApi,
  doctors: doctorsNextApi,
  nurses: nursesNextApi,
};
