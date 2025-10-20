import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  price: number;
  description: string;
  images: string[];
  categories: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Le nom du produit est requis'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères'],
    minlength: [2, 'Le nom doit contenir au moins 2 caractères'],
  },
  price: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: [0, 'Le prix ne peut pas être négatif'],
    max: [100000, 'Le prix ne peut pas dépasser 100000€'],
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    trim: true,
    maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères'],
    minlength: [1, 'La description est requise'],
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
  categories: [{
    type: String,
    trim: true,
    maxlength: [50, 'Le nom de catégorie ne peut pas dépasser 50 caractères'],
  }],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Index pour la recherche
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ categories: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ createdAt: -1 });

// Validation personnalisée
ProductSchema.pre('save', function(next) {
  if (this.categories.length === 0) {
    this.categories = ['Général'];
  }
  if (this.images.length === 0) {
    this.images = ['/images/default-cake.jpg'];
  }
  next();
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);