/** Dev/stub email — replace with AWS SES in production. */

export function logPasswordResetLink(email: string, rawToken: string): void {
  console.info(
    `[vital-track email] Password reset for ${email}: append ?token=${rawToken} to your app reset route`,
  );
}

export function logCaregiverInvite(email: string, rawToken: string): void {
  console.info(
    `[vital-track email] Caregiver invite for ${email}: POST /api/v1/caregivers/invite/${rawToken}/accept`,
  );
}
