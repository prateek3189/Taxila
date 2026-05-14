import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    displayName: { type: String, required: true, trim: true },
    role: {
      type: String,
      required: true,
      enum: ['parent', 'caregiver', 'doctor', 'clinic_admin', 'platform_admin'],
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
    },
    clinicDetails: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true },
);

export type UserDoc = mongoose.InferSchemaType<typeof userSchema> & { _id: mongoose.Types.ObjectId };

export const UserModel =
  (mongoose.models.User as mongoose.Model<UserDoc>) ||
  mongoose.model<UserDoc>('User', userSchema);
