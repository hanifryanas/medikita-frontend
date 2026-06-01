'use client';

import { nextApi } from '@/lib/api/next';
import type { PatientLookupType } from '@/lib/api/next/patients/lookup-patient';
import type { Patient } from '@/lib/types/patients';
import { useState } from 'react';

interface UseLinkExistingPatientArgs {
  accessToken: string | null | undefined;
  onLinked: () => void | Promise<void>;
}

export const useLinkExistingPatient = ({ accessToken, onLinked }: UseLinkExistingPatientArgs) => {
  const [type, setType] = useState<PatientLookupType>('mrn');
  const [value, setValue] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [result, setResult] = useState<Patient | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setType('mrn');
    setValue('');
    setDateOfBirth('');
    setResult(null);
    setError(null);
  };

  const clearResult = () => {
    setResult(null);
    setError(null);
  };

  const lookup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!accessToken) return;
    const trimmed = value.trim();
    if (!trimmed || !dateOfBirth) {
      setError('Enter the patient identifier and date of birth.');
      return;
    }
    setIsLookingUp(true);
    setError(null);
    try {
      const patient = await nextApi.patients.lookupPatient({
        accessToken,
        type,
        value: trimmed,
        dateOfBirth,
      });
      setResult(patient);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Patient not found.');
    } finally {
      setIsLookingUp(false);
    }
  };

  const confirm = async () => {
    if (!accessToken || !result) return;
    setIsLinking(true);
    setError(null);
    try {
      await nextApi.patients.linkExistingPatient({ accessToken, patientId: result.patientId });
      await onLinked();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to link patient.');
    } finally {
      setIsLinking(false);
    }
  };

  return {
    type,
    setType,
    value,
    setValue,
    dateOfBirth,
    setDateOfBirth,
    result,
    isLookingUp,
    isLinking,
    error,
    lookup,
    confirm,
    clearResult,
    reset,
  };
};
