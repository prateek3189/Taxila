import mongoose from 'mongoose';

const caregiverInviteSchema = new mongoose.Schema(
  {
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    inviteeEmail: { type: String, required: true, lowercase: true, trim: true },
    permissionLevel: { type: String, enum: ['read_only', 'full'], required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'revoked'],
      default: 'pending',
    },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

export type CaregiverInviteDoc = mongoose.InferSchemaType<typeof caregiverInviteSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const CaregiverInviteModel =
  (mongoose.models.CaregiverInvite as mongoose.Model<CaregiverInviteDoc>) ||
  mongoose.model<CaregiverInviteDoc>('CaregiverInvite', caregiverInviteSchema);
