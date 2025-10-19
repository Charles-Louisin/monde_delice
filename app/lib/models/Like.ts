import mongoose, { Schema, Document } from 'mongoose';

export interface ILike extends Document {
  blogId: string;
  ipAddress: string;
  userAgent?: string;
  createdAt: Date;
}

const LikeSchema = new Schema<ILike>({
  blogId: {
    type: String,
    required: [true, 'L\'ID du blog est requis'],
    ref: 'Blog'
  },
  ipAddress: {
    type: String,
    required: [true, 'L\'adresse IP est requise'],
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index pour éviter les doublons
LikeSchema.index({ blogId: 1, ipAddress: 1 }, { unique: true });
LikeSchema.index({ blogId: 1 });
LikeSchema.index({ createdAt: -1 });

export default mongoose.models.Like || mongoose.model<ILike>('Like', LikeSchema);