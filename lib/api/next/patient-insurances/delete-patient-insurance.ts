interface DeletePatientInsuranceArgs {
  accessToken: string;
  patientId: string;
  patientInsuranceId: number;
}

export const deletePatientInsurance = async ({
  accessToken,
  patientId,
  patientInsuranceId,
}: DeletePatientInsuranceArgs): Promise<void> => {
  const res = await fetch(`/api/patients/${patientId}/insurances/${patientInsuranceId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to remove insurance.' }));
    throw new Error(err?.message ?? 'Failed to remove insurance.');
  }
};
