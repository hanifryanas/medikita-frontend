interface LinkExistingPatientArgs {
  accessToken: string;
  patientId: string;
}

export const linkExistingPatient = async ({
  accessToken,
  patientId,
}: LinkExistingPatientArgs): Promise<string> => {
  const res = await fetch('/api/patients/me/link', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ patientId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to link patient.' }));
    throw new Error(err?.message ?? 'Failed to link patient.');
  }

  return (await res.json()).patientId as string;
};
