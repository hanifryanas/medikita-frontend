import { AuthHydrator } from './auth-hydrator';
import { DepartmentHydrator } from './department-hydrator';
import { DoctorHydrator } from './doctor-hydrator';

export const Hydrator = () => (
  <>
    <AuthHydrator />
    <DepartmentHydrator />
    <DoctorHydrator />
  </>
);
