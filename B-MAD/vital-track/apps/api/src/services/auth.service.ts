import bcrypt from 'bcrypt';
import type { ApiEnv } from '@vital-track/config';
import type { LoginBody, RegisterBody } from '@vital-track/shared-types';
import type { UserRole } from '@vital-track/shared-types';
import { AppError } from '../lib/AppError';
import { generateOpaqueToken, hashOpaqueToken } from '../lib/cryptoTokens';
import { signAccessToken } from '../lib/jwt';
import { PasswordResetTokenModel } from '../models/PasswordResetToken';
import { RefreshTokenModel } from '../models/RefreshToken';
import { UsedRefreshTokenModel } from '../models/UsedRefreshToken';
import { UserModel } from '../models/User';
import { logPasswordResetLink } from './email.stub';

const BCRYPT_ROUNDS = 12;

export async function registerUser(
  _env: ApiEnv,
  body: RegisterBody,
): Promise<{ userId: string; email: string; role: string }> {
  const existing = await UserModel.findOne({ email: body.email });
  if (existing) {
    throw new AppError(409, 'EMAIL_ALREADY_EXISTS', 'An account with this email already exists');
  }
  const passwordHash = await bcrypt.hash(body.password, BCRYPT_ROUNDS);
  const doc = await UserModel.create({
    email: body.email,
    passwordHash,
    displayName: body.displayName,
    role: body.role,
    verificationStatus: body.role === 'doctor' ? 'pending' : undefined,
    clinicDetails: body.role === 'doctor' ? body.clinicDetails : undefined,
  });
  return { userId: doc._id.toString(), email: doc.email, role: doc.role };
}

export async function loginUser(
  env: ApiEnv,
  body: LoginBody,
): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}> {
  const user = await UserModel.findOne({ email: body.email });
  if (!user) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }
  const passwordOk = await bcrypt.compare(body.password, user.passwordHash);
  if (!passwordOk) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }

  await RefreshTokenModel.deleteMany({ userId: user._id });
  await UsedRefreshTokenModel.deleteMany({ userId: user._id });

  const rawRefresh = generateOpaqueToken();
  const refreshExpires = new Date();
  refreshExpires.setDate(refreshExpires.getDate() + env.JWT_REFRESH_EXPIRES_DAYS);

  await RefreshTokenModel.create({
    userId: user._id,
    tokenHash: hashOpaqueToken(rawRefresh),
    expiresAt: refreshExpires,
  });

  const accessToken = signAccessToken(env, {
    sub: user._id.toString(),
    email: user.email,
    role: user.role as UserRole,
  });

  return {
    accessToken,
    refreshToken: rawRefresh,
    expiresIn: env.JWT_ACCESS_EXPIRES_MIN * 60,
    tokenType: 'Bearer',
  };
}

export async function refreshSession(
  env: ApiEnv,
  refreshToken: string,
): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}> {
  const tokenHash = hashOpaqueToken(refreshToken);
  const doc = await RefreshTokenModel.findOne({ tokenHash });

  if (!doc) {
    const consumed = await UsedRefreshTokenModel.findOne({ tokenHash });
    if (consumed) {
      await RefreshTokenModel.deleteMany({ userId: consumed.userId });
      throw new AppError(
        401,
        'REFRESH_TOKEN_REUSE',
        'Refresh token reuse detected; all sessions invalidated',
      );
    }
    throw new AppError(401, 'UNAUTHORIZED', 'Invalid or expired refresh token');
  }

  if (doc.expiresAt.getTime() < Date.now()) {
    await RefreshTokenModel.deleteMany({ userId: doc.userId });
    throw new AppError(401, 'UNAUTHORIZED', 'Invalid or expired refresh token');
  }

  const user = await UserModel.findById(doc.userId);
  if (!user) {
    await RefreshTokenModel.deleteMany({ userId: doc.userId });
    throw new AppError(401, 'UNAUTHORIZED', 'User not found');
  }

  const usedExpires = new Date();
  usedExpires.setDate(usedExpires.getDate() + env.JWT_REFRESH_EXPIRES_DAYS);
  await UsedRefreshTokenModel.create({
    tokenHash,
    userId: doc.userId,
    expiresAt: usedExpires,
  });
  await RefreshTokenModel.deleteOne({ _id: doc._id });

  const rawRefresh = generateOpaqueToken();
  const refreshExpires = new Date();
  refreshExpires.setDate(refreshExpires.getDate() + env.JWT_REFRESH_EXPIRES_DAYS);

  await RefreshTokenModel.create({
    userId: user._id,
    tokenHash: hashOpaqueToken(rawRefresh),
    expiresAt: refreshExpires,
  });

  const accessToken = signAccessToken(env, {
    sub: user._id.toString(),
    email: user.email,
    role: user.role as UserRole,
  });

  return {
    accessToken,
    refreshToken: rawRefresh,
    expiresIn: env.JWT_ACCESS_EXPIRES_MIN * 60,
    tokenType: 'Bearer',
  };
}

export async function logoutSession(refreshToken: string): Promise<void> {
  const tokenHash = hashOpaqueToken(refreshToken);
  await RefreshTokenModel.deleteOne({ tokenHash });
}

export async function forgotPassword(env: ApiEnv, email: string): Promise<void> {
  const user = await UserModel.findOne({ email });
  if (!user) {
    return;
  }
  await PasswordResetTokenModel.deleteMany({ userId: user._id });

  const raw = generateOpaqueToken();
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + env.PASSWORD_RESET_EXPIRES_MIN);

  await PasswordResetTokenModel.create({
    userId: user._id,
    tokenHash: hashOpaqueToken(raw),
    expiresAt,
  });

  logPasswordResetLink(email, raw);
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  const tokenHash = hashOpaqueToken(token);
  const doc = await PasswordResetTokenModel.findOne({ tokenHash });
  if (!doc || doc.usedAt || doc.expiresAt.getTime() < Date.now()) {
    throw new AppError(400, 'INVALID_OR_EXPIRED_TOKEN', 'Reset link is invalid or has expired');
  }

  const user = await UserModel.findById(doc.userId);
  if (!user) {
    throw new AppError(400, 'INVALID_OR_EXPIRED_TOKEN', 'User not found');
  }

  user.passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
  await user.save();

  doc.usedAt = new Date();
  await doc.save();

  await RefreshTokenModel.deleteMany({ userId: user._id });
  await UsedRefreshTokenModel.deleteMany({ userId: user._id });
}
