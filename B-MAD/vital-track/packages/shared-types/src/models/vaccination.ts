export const VACCINATION_RECORD_STATES = [
  'PENDING',
  'APPROVED',
  'REJECTED',
  'EXPIRED',
] as const;

export type VaccinationRecordState = (typeof VACCINATION_RECORD_STATES)[number];

export const VACCINE_PLAN_STATUSES = ['draft', 'published'] as const;
export type VaccinePlanStatus = (typeof VACCINE_PLAN_STATUSES)[number];

export interface VaccineEntry {
  id: string;
  vaccineName: string;
  dueDate: string;
  notes?: string;
}

export interface VaccinePlan {
  id: string;
  childId: string;
  doctorId: string;
  status: VaccinePlanStatus;
  entries: VaccineEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface VaccinationRecord {
  id: string;
  childId: string;
  doctorId?: string;
  vaccineName: string;
  state: VaccinationRecordState;
  lotNumber?: string;
  administeredAt?: string;
  dueDate?: string;
  pendingExpiresAt?: string;
  rejectionNote?: string;
  createdAt: string;
  updatedAt: string;
}
