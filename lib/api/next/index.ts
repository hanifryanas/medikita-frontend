import { authNextApi } from './auth';
import { departmentsNextApi } from './departments';
import { doctorsNextApi } from './doctors';
import { nursesNextApi } from './nurses';
import { patientInsurancesNextApi } from './patient-insurances';
import { patientsNextApi } from './patients';

export const nextApi = {
  auth: authNextApi,
  departments: departmentsNextApi,
  doctors: doctorsNextApi,
  nurses: nursesNextApi,
  patients: patientsNextApi,
  patientInsurances: patientInsurancesNextApi,
};
