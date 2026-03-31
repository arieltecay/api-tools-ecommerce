import HeroSlide from '../../models/hero-slide/model';
import { IHeroSlide } from '../../models/hero-slide/types';
import Product from '../../models/product/product.model';

export class HeroSlideService {
  static async getAll(onlyActive = false) {
    const filter = onlyActive ? { isActive: true } : {};
    return await HeroSlide.find(filter).sort({ sortOrder: 1, createdAt: -1 });
  }

  static async getById(id: string) {
    return await HeroSlide.findById(id);
  }

  static async create(data: Partial<IHeroSlide>) {
    // Validate product existence
    if (data.productUuid) {
      const product = await Product.findOne({ uuid: data.productUuid });
      if (!product) throw new Error('Product not found');
    }
    
    return await HeroSlide.create(data);
  }

  static async update(id: string, data: Partial<IHeroSlide>) {
    // Validate product existence if changed
    if (data.productUuid) {
      const product = await Product.findOne({ uuid: data.productUuid });
      if (!product) throw new Error('Product not found');
    }
    
    return await HeroSlide.findByIdAndUpdate(id, data, { new: true });
  }

  static async delete(id: string) {
    return await HeroSlide.findByIdAndDelete(id);
  }

  /**
   * For the Shop: Fetch active slides with their associated product data
   */
  static async getPublicSlides() {
    const slides = await HeroSlide.find({ isActive: true }).sort({ sortOrder: 1 });
    
    // Fetch product details for each slide
    const slidesWithProducts = await Promise.all(slides.map(async (slide) => {
      const product = await Product.findOne({ uuid: slide.productUuid })
        .select('name slug category images price')
        .lean();
      
      return {
        ...slide.toObject(),
        product
      };
    }));
    
    return slidesWithProducts;
  }
}
