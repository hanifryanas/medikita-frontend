import { useAuthStore } from './auth-store';
import { useCareTeamsStore } from './care-teams-store';
import { useConfirmStore } from './confirm-store';
import { useDepartmentStore } from './department-store';
import { usePatientStore } from './patient-store';
import { useToastStore } from './toast-store';

/**
 * Reactive store access — call inside the render body of a client component.
 * Each property subscribes the component to that store's updates.
 */
export const useStores = () => ({
  authStore: useAuthStore(),
  careTeamsStore: useCareTeamsStore(),
  departmentStore: useDepartmentStore(),
  patientStore: usePatientStore(),
});

/**
 * Non-reactive store snapshots — for use inside `useEffect`, event handlers,
 * and other imperative code paths. Reading these does NOT subscribe the
 * caller to changes.
 *
 * Example:
 *   useEffect(() => {
 *     if (stores.auth.status === AuthStatus.Authenticated) return;
 *     void stores.auth.hydrate?.();
 *   }, []);
 */
export const stores = {
  get auth() {
    return useAuthStore.getState();
  },
  get careTeams() {
    return useCareTeamsStore.getState();
  },
  get department() {
    return useDepartmentStore.getState();
  },
  get patient() {
    return usePatientStore.getState();
  },
  get toast() {
    return useToastStore.getState();
  },
  get confirm() {
    return useConfirmStore.getState();
  },
};
