import mongoose from 'mongoose';

/** Hashes of refresh tokens invalidated after rotation; used to detect reuse (OAuth BCP). */
const usedRefreshTokenSchema = new mongoose.Schema(
  {
    tokenHash: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

usedRefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type UsedRefreshTokenDoc = mongoose.InferSchemaType<typeof usedRefreshTokenSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const UsedRefreshTokenModel =
  (mongoose.models.UsedRefreshToken as mongoose.Model<UsedRefreshTokenDoc>) ||
  mongoose.model<UsedRefreshTokenDoc>('UsedRefreshToken', usedRefreshTokenSchema);
