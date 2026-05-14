import mongoose from 'mongoose';

const caregiverAccessSchema = new mongoose.Schema(
  {
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    caregiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    permissionLevel: { type: String, enum: ['read_only', 'full'], required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

caregiverAccessSchema.index({ parentId: 1, caregiverId: 1 }, { unique: true });

export type CaregiverAccessDoc = mongoose.InferSchemaType<typeof caregiverAccessSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const CaregiverAccessModel =
  (mongoose.models.CaregiverAccess as mongoose.Model<CaregiverAccessDoc>) ||
  mongoose.model<CaregiverAccessDoc>('CaregiverAccess', caregiverAccessSchema);
