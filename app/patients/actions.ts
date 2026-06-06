'use server';

import { nestApi } from '@/lib/api/nest';
import { getAccessTokenFromCookies } from '@/lib/auth/server';
import type {
  CreatePatientPayload,
  PatientInsurance,
  PatientInsurancePayload,
} from '@/lib/types/patients';

export type ActionResult<T = void> = { ok: true; data: T } | { ok: false; error: string };

const unauthenticated = <T = void>(): ActionResult<T> => ({
  ok: false,
  error: 'Not authenticated.',
});

const toError = <T = void>(err: unknown, fallback: string): ActionResult<T> => ({
  ok: false,
  error: err instanceof Error ? err.message : fallback,
});

export const createPatientAction = async (
  payload: CreatePatientPayload
): Promise<ActionResult<{ patientId: string }>> => {
  const token = await getAccessTokenFromCookies();
  if (!token) return unauthenticated();
  try {
    const patientId = await nestApi.post<string>('patients/me', payload, { token });
    return { ok: true, data: { patientId } };
  } catch (err) {
    return toError(err, 'Failed to create patient.');
  }
};

export const updatePatientAction = async (
  patientId: string,
  payload: Partial<CreatePatientPayload>
): Promise<ActionResult> => {
  const token = await getAccessTokenFromCookies();
  if (!token) return unauthenticated();
  try {
    await nestApi.patch(`patients/${patientId}`, payload, { token });
    return { ok: true, data: undefined };
  } catch (err) {
    return toError(err, 'Failed to update patient.');
  }
};

export const addPatientInsuranceAction = async (
  patientId: string,
  payload: PatientInsurancePayload
): Promise<ActionResult<PatientInsurance>> => {
  const token = await getAccessTokenFromCookies();
  if (!token) return unauthenticated();
  try {
    const insurance = await nestApi.post<PatientInsurance>(
      `patients/${patientId}/insurances`,
      payload,
      { token }
    );
    return { ok: true, data: insurance };
  } catch (err) {
    return toError(err, 'Failed to add insurance.');
  }
};

export const removePatientInsuranceAction = async (
  patientId: string,
  patientInsuranceId: number
): Promise<ActionResult> => {
  const token = await getAccessTokenFromCookies();
  if (!token) return unauthenticated();
  try {
    await nestApi.delete(`patients/${patientId}/insurances/${patientInsuranceId}`, { token });
    return { ok: true, data: undefined };
  } catch (err) {
    return toError(err, 'Failed to remove insurance.');
  }
};
