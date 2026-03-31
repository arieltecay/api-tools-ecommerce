import mongoose, { Schema } from 'mongoose';
import { IHeroSlide } from './types';

const heroSlideSchema = new Schema<IHeroSlide>({
  productUuid: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String },
  buttonText: { type: String, default: 'Ver producto' },
  imageUrl: { type: String },
  backgroundColor: { type: String, default: '#3B82F6' }, // Default blue-500
  textColor: { type: String, default: '#FFFFFF' },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Index for performance
heroSlideSchema.index({ isActive: 1, sortOrder: 1 });

const HeroSlide = mongoose.model<IHeroSlide>('HeroSlide', heroSlideSchema);

export default HeroSlide;
