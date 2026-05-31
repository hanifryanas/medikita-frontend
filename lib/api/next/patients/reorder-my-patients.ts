interface ReorderMyPatientsArgs {
  accessToken: string;
  patientIds: string[];
}

export const reorderMyPatients = async ({
  accessToken,
  patientIds,
}: ReorderMyPatientsArgs): Promise<void> => {
  const res = await fetch('/api/patients/me/order', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      items: patientIds.map((patientId, index) => ({ patientId, ordinal: index + 1 })),
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Failed to update patient order.' }));
    throw new Error(err?.message ?? 'Failed to update patient order.');
  }
};
