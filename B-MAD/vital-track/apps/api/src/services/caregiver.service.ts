import type { ApiEnv } from '@vital-track/config';
import bcrypt from 'bcrypt';
import { AppError } from '../lib/AppError';
import { generateOpaqueToken, hashOpaqueToken } from '../lib/cryptoTokens';
import { CaregiverAccessModel } from '../models/CaregiverAccess';
import { CaregiverInviteModel } from '../models/CaregiverInvite';
import { RefreshTokenModel } from '../models/RefreshToken';
import { UserModel } from '../models/User';
import { logCaregiverInvite } from './email.stub';

const BCRYPT_ROUNDS = 12;
const INVITE_EXPIRES_DAYS = 14;

export async function createInvite(
  _env: ApiEnv,
  parentUserId: string,
  inviteeEmail: string,
  permissionLevel: 'read_only' | 'full',
): Promise<{ inviteId: string }> {
  const existing = await CaregiverInviteModel.findOne({
    parentId: parentUserId,
    inviteeEmail,
    status: 'pending',
  });
  if (existing) {
    throw new AppError(409, 'INVITE_PENDING', 'An invite is already pending for this email');
  }

  const raw = generateOpaqueToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + INVITE_EXPIRES_DAYS);

  const doc = await CaregiverInviteModel.create({
    parentId: parentUserId,
    inviteeEmail,
    permissionLevel,
    status: 'pending',
    tokenHash: hashOpaqueToken(raw),
    expiresAt,
  });

  logCaregiverInvite(inviteeEmail, raw);
  return { inviteId: doc._id.toString() };
}

export async function acceptInvite(
  rawToken: string,
  body: { displayName?: string; password?: string },
  authenticatedUserId?: string,
): Promise<{ status: string }> {
  const tokenHash = hashOpaqueToken(rawToken);
  const invite = await CaregiverInviteModel.findOne({ tokenHash });
  if (!invite || invite.status !== 'pending' || invite.expiresAt.getTime() < Date.now()) {
    throw new AppError(400, 'INVALID_INVITE', 'Invite is invalid or expired');
  }

  let caregiverId: string;

  const existingUser = await UserModel.findOne({ email: invite.inviteeEmail });
  if (existingUser) {
    if (authenticatedUserId && existingUser._id.toString() !== authenticatedUserId) {
      throw new AppError(403, 'FORBIDDEN', 'Sign in as the invited email to accept');
    }
    if (!authenticatedUserId) {
      throw new AppError(401, 'UNAUTHORIZED', 'Sign in with the invited email to accept this invite');
    }
    caregiverId = existingUser._id.toString();
    if (existingUser.role !== 'caregiver') {
      throw new AppError(400, 'INVALID_ACCOUNT', 'This email is already registered with a different role');
    }
  } else {
    if (!body.displayName?.trim() || !body.password) {
      throw new AppError(
        400,
        'VALIDATION_ERROR',
        'displayName and password are required to create a caregiver account',
      );
    }
    const passwordHash = await bcrypt.hash(body.password, BCRYPT_ROUNDS);
    const cg = await UserModel.create({
      email: invite.inviteeEmail,
      passwordHash,
      displayName: body.displayName.trim(),
      role: 'caregiver',
    });
    caregiverId = cg._id.toString();
  }

  await CaregiverAccessModel.findOneAndUpdate(
    { parentId: invite.parentId, caregiverId },
    {
      parentId: invite.parentId,
      caregiverId,
      permissionLevel: invite.permissionLevel,
      active: true,
    },
    { upsert: true },
  );

  invite.status = 'accepted';
  await invite.save();

  return { status: 'accepted' };
}

export async function declineInvite(rawToken: string): Promise<{ status: string }> {
  const tokenHash = hashOpaqueToken(rawToken);
  const invite = await CaregiverInviteModel.findOne({ tokenHash });
  if (!invite || invite.status !== 'pending') {
    throw new AppError(400, 'INVALID_INVITE', 'Invite is invalid');
  }
  invite.status = 'declined';
  await invite.save();
  return { status: 'declined' };
}

export async function revokeCaregiverAccess(
  parentUserId: string,
  caregiverUserId: string,
): Promise<void> {
  const access = await CaregiverAccessModel.findOne({
    parentId: parentUserId,
    caregiverId: caregiverUserId,
    active: true,
  });
  if (!access) {
    throw new AppError(404, 'NOT_FOUND', 'Caregiver access not found');
  }
  access.active = false;
  await access.save();
  await RefreshTokenModel.deleteMany({ userId: caregiverUserId });
}
