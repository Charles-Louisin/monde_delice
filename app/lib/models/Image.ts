import mongoose, { Schema, Document } from 'mongoose';

export interface IImage extends Document {
  filename: string;
  originalName: string;
  url: string;
  size: number;
  mimetype: string;
  uploadedBy?: string;
  createdAt: Date;
}

const ImageSchema = new Schema<IImage>({
  filename: {
    type: String,
    required: [true, 'Le nom de fichier est requis'],
    trim: true
  },
  originalName: {
    type: String,
    required: [true, 'Le nom original est requis'],
    trim: true
  },
  url: {
    type: String,
    required: [true, 'L\'URL est requise'],
    trim: true
  },
  size: {
    type: Number,
    required: [true, 'La taille est requise'],
    min: [0, 'La taille ne peut pas être négative']
  },
  mimetype: {
    type: String,
    required: [true, 'Le type MIME est requis'],
    trim: true
  },
  uploadedBy: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index pour la recherche
ImageSchema.index({ filename: 1 });
ImageSchema.index({ mimetype: 1 });
ImageSchema.index({ createdAt: -1 });

export default mongoose.models.Image || mongoose.model<IImage>('Image', ImageSchema);