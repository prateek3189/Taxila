export const USER_ROLES = [
  'parent',
  'caregiver',
  'doctor',
  'clinic_admin',
  'platform_admin',
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const VERIFICATION_STATUSES = ['pending', 'approved', 'rejected'] as const;
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];

export interface User {
  id: string;
  email: string;
  role: UserRole;
  displayName: string;
  verificationStatus?: VerificationStatus;
  createdAt: string;
  updatedAt: string;
}
