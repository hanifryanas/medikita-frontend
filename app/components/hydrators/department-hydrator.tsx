'use client';

import { useDepartmentStore } from '@/lib/stores';
import type { Department } from '@/lib/types/departments';
import type { Employee } from '@/lib/types/employees';
import { useEffect } from 'react';

// TODO: replace with real API call when backend endpoint is available.
//
// Mock helper: builds a doctor `Employee` with just enough data for the
// `/specialties` cards. Cast at the seam — real data will arrive fully shaped
// from the backend.
const mockDoctor = (
  id: string,
  firstName: string,
  lastName: string,
  jobTitle: string,
  startDate: string,
  title?: string
): Employee =>
  ({
    employeeId: id,
    fullName: `${firstName} ${lastName}`,
    jobTitle,
    startDate,
    user: { firstName, lastName },
    doctor: { doctorId: `doctor-${id}`, title, jobTitle },
  }) as unknown as Employee;

const MOCK_DEPARTMENTS: Department[] = [
  {
    departmentId: 1,
    typeCode: 'cardiology',
    displayName: 'Heart Center',
    iconName: 'heart-pulse',
    description:
      'Comprehensive cardiac care, from diagnostic imaging to interventional procedures, delivered by board-certified cardiologists.',
    featuredOrdinal: 1,
    isClinical: true,
    isClinic: true,
    isActive: true,
    employees: [
      mockDoctor(
        'e-1-1',
        'Aldo',
        'Pradana',
        'Senior Interventional Cardiologist',
        '2008-03-12',
        'Sp.JP'
      ),
      mockDoctor('e-1-2', 'Ratna', 'Wijaya', 'Cardiologist', '2013-07-01', 'Sp.JP'),
      mockDoctor('e-1-3', 'Bayu', 'Kurniawan', 'Cardiologist', '2016-11-20', 'Sp.JP'),
      mockDoctor('e-1-4', 'Sinta', 'Maharani', 'Cardiologist', '2020-02-04', 'Sp.JP'),
    ],
  },
  {
    departmentId: 2,
    typeCode: 'pediatrics',
    displayName: 'Children Care',
    iconName: 'baby',
    description:
      'Pediatric expertise focused on growth, development and family-centered care for infants, children and adolescents.',
    featuredOrdinal: 2,
    isClinical: true,
    isClinic: true,
    isActive: true,
    employees: [
      mockDoctor('e-2-1', 'Maya', 'Hartanto', 'Senior Pediatrician', '2009-06-15', 'Sp.A'),
      mockDoctor('e-2-2', 'Reza', 'Saputra', 'Pediatrician', '2014-09-02', 'Sp.A'),
      mockDoctor('e-2-3', 'Lila', 'Anggraini', 'Pediatrician', '2018-01-10', 'Sp.A'),
    ],
  },
  {
    departmentId: 3,
    typeCode: 'dermatology',
    displayName: 'Skin & Aesthetics',
    iconName: 'sparkles',
    description:
      'Medical and cosmetic dermatology — from skin cancer screening to advanced aesthetic treatments and laser therapy.',
    featuredOrdinal: 3,
    isClinical: true,
    isClinic: true,
    isActive: true,
    employees: [
      mockDoctor('e-3-1', 'Dewi', 'Lestari', 'Senior Dermatologist', '2011-04-22', 'Sp.KK'),
      mockDoctor('e-3-2', 'Andre', 'Wibowo', 'Dermatologist', '2017-08-30', 'Sp.KK'),
    ],
  },
  {
    departmentId: 4,
    typeCode: 'neuroscience',
    displayName: 'Neuroscience',
    iconName: 'brain',
    isClinical: true,
    isClinic: true,
    isActive: true,
  },
  {
    departmentId: 5,
    typeCode: 'orthopedics',
    displayName: 'Orthopedics',
    iconName: 'bone',
    isClinical: true,
    isClinic: true,
    isActive: true,
  },
  {
    departmentId: 6,
    typeCode: 'ophthalmology',
    displayName: 'Eye Center',
    iconName: 'eye',
    isClinical: true,
    isClinic: true,
    isActive: true,
  },
  {
    departmentId: 7,
    typeCode: 'dental',
    displayName: 'Dental Clinic',
    iconName: 'smile',
    isClinical: true,
    isClinic: true,
    isActive: true,
  },
  {
    departmentId: 8,
    typeCode: 'obgyn',
    displayName: "Women's Health",
    iconName: 'venus',
    isClinical: true,
    isClinic: true,
    isActive: true,
  },
  {
    departmentId: 9,
    typeCode: 'er',
    displayName: 'Emergency Room',
    iconName: 'siren',
    isClinical: true,
    isClinic: false,
    isActive: true,
  },
  {
    departmentId: 10,
    typeCode: 'operatingtheatre',
    displayName: 'Operating Theatre',
    iconName: 'syringe',
    isClinical: true,
    isClinic: false,
    isActive: true,
  },
];

export const DepartmentHydrator = () => {
  useEffect(() => {
    (async () => {
      const { isLoaded, isLoading, setDepartments, setFeaturedDepartments, setLoading } =
        useDepartmentStore.getState();
      if (isLoaded || isLoading) return;

      setLoading(true);
      try {
        // Simulate async fetch — swap for real API call later.
        const data = await Promise.resolve(MOCK_DEPARTMENTS);
        setDepartments(data);
        setFeaturedDepartments(
          data
            .filter((d) => d.featuredOrdinal != null)
            .sort((a, b) => (a.featuredOrdinal ?? 0) - (b.featuredOrdinal ?? 0))
        );
      } catch {
        setLoading(false);
      }
    })();
  }, []);

  return null;
};
