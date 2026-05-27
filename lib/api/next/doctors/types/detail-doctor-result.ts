import { DoctorResult } from './doctor-result';

export interface DetailDoctorResult extends DoctorResult {
  employee: DoctorResult['employee'] & {
    user: DoctorResult['employee']['user'] & {
      dateOfBirth: string;
      age: number;
    };
  };
  patientCount: number;
}
