import { AuthHydrator } from './auth-hydrator';
import { CareTeamHydrator } from './care-team-hydrator';
import { DepartmentHydrator } from './department-hydrator';
import { PatientHydrator } from './patients-hydrator';

export const Hydrator = () => (
  <>
    <AuthHydrator />
    <DepartmentHydrator />
    <CareTeamHydrator />
    <PatientHydrator />
  </>
);
