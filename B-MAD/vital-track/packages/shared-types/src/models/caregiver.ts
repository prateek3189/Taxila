export const CAREGIVER_PERMISSION_LEVELS = ['read_only', 'full'] as const;
export type CaregiverPermissionLevel = (typeof CAREGIVER_PERMISSION_LEVELS)[number];

export const CAREGIVER_INVITE_STATUSES = ['pending', 'accepted', 'declined', 'revoked'] as const;
export type CaregiverInviteStatus = (typeof CAREGIVER_INVITE_STATUSES)[number];

export interface CaregiverInvite {
  id: string;
  parentId: string;
  inviteeEmail: string;
  permissionLevel: CaregiverPermissionLevel;
  status: CaregiverInviteStatus;
  createdAt: string;
  updatedAt: string;
}
