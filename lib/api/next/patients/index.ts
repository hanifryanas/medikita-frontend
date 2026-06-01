import { createPatient } from './create-patient';
import { getMyPatients } from './get-my-patients';
import { linkExistingPatient } from './link-existing-patient';
import { lookupPatient } from './lookup-patient';
import { reorderMyPatients } from './reorder-my-patients';
import { unlinkPatient } from './unlink-patient';
import { updatePatient } from './update-patient';

export const patientsNextApi = {
  getMyPatients,
  createPatient,
  reorderMyPatients,
  lookupPatient,
  linkExistingPatient,
  updatePatient,
  unlinkPatient,
};
