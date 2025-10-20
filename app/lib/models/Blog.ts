import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  images: string[];
  featured: boolean;
  likes: number;
  tags: string[];
  meta: {
    author: string;
    eventDate?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>({
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true,
    maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères'],
    minlength: [5, 'Le titre doit contenir au moins 5 caractères'],
  },
  slug: {
    type: String,
    required: [true, 'Le slug est requis'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Le slug ne peut contenir que des lettres minuscules, des chiffres et des tirets'],
  },
  excerpt: {
    type: String,
    required: [true, 'L\'extrait est requis'],
    trim: true,
    maxlength: [300, 'L\'extrait ne peut pas dépasser 300 caractères'],
    minlength: [20, 'L\'extrait doit contenir au moins 20 caractères'],
  },
  content: {
    type: String,
    required: [true, 'Le contenu est requis'],
    trim: true,
    minlength: [50, 'Le contenu doit contenir au moins 50 caractères'],
  },
  images: [{
    type: String,
    validate: {
      validator: function(v: string) {
        // Accepter les URLs UploadThing (utfs.io) et les URLs d'images classiques
        return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(v) || 
               /^https?:\/\/.*uploadthing\.com.*$/i.test(v) ||
               /^https?:\/\/.*utfs\.io.*$/i.test(v);
      },
      message: 'URL d\'image invalide'
    }
  }],
  featured: {
    type: Boolean,
    default: false,
  },
  likes: {
    type: Number,
    default: 0,
    min: [0, 'Le nombre de likes ne peut pas être négatif'],
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Le nom de tag ne peut pas dépasser 30 caractères'],
  }],
  meta: {
    author: {
      type: String,
      required: [true, 'L\'auteur est requis'],
      trim: true,
      maxlength: [100, 'Le nom de l\'auteur ne peut pas dépasser 100 caractères'],
    },
    eventDate: {
      type: Date,
      validate: {
        validator: function(v: Date) {
          return !v || v <= new Date();
        },
        message: 'La date de l\'événement ne peut pas être dans le futur'
      }
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Index pour la recherche
BlogSchema.index({ title: 'text', excerpt: 'text', content: 'text' });
BlogSchema.index({ featured: 1 });
BlogSchema.index({ tags: 1 });
BlogSchema.index({ likes: -1 });
BlogSchema.index({ createdAt: -1 });
BlogSchema.index({ 'meta.eventDate': -1 });

// Validation personnalisée
BlogSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  if (this.tags.length === 0) {
    this.tags = ['Général'];
  }
  if (this.images.length === 0) {
    this.images = ['/images/default-blog.jpg'];
  }
  next();
});

export default mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);