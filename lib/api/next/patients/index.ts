import { createPatient } from './create-patient';
import { getMyPatients } from './get-my-patients';
import { reorderMyPatients } from './reorder-my-patients';

export const patientsNextApi = {
  getMyPatients,
  createPatient,
  reorderMyPatients,
};
