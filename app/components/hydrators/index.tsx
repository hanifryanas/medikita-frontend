import { AuthHydrator } from './auth-hydrator';
import { DepartmentHydrator } from './department-hydrator';

export const Hydrator = () => (
  <>
    <AuthHydrator />
    <DepartmentHydrator />
  </>
);
