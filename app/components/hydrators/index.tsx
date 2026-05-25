import { AuthHydrator } from './auth-hydrator';
import { CareTeamHydrator } from './care-team-hydrator';
import { DepartmentHydrator } from './department-hydrator';

export const Hydrator = () => (
  <>
    <AuthHydrator />
    <DepartmentHydrator />
    <CareTeamHydrator />
  </>
);
