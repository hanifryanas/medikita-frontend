interface UnlinkPatientArgs {
  accessToken: string;
  patientId: string;
}

export const unlinkPatient = async ({
  accessToken,
  patientId,
}: UnlinkPatientArgs): Promise<void> => {
  const res = await fetch(`/api/patients/me/link/${patientId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to remove patient.' }));
    throw new Error(err?.message ?? 'Failed to remove patient.');
  }
};
