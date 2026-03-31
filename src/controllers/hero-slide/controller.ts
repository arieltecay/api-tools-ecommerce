import { Request, Response } from 'express';
import { HeroSlideService } from '../../services/hero-slide/service';

export class HeroSlideController {
  static async getAll(req: Request, res: Response) {
    try {
      const onlyActive = req.query.onlyActive === 'true';
      const slides = await HeroSlideService.getAll(onlyActive);
      res.json(slides);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getPublic(req: Request, res: Response) {
    try {
      const slides = await HeroSlideService.getPublicSlides();
      res.json(slides);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const slide = await HeroSlideService.getById(req.params.id);
      if (!slide) return res.status(404).json({ message: 'Slide not found' });
      res.json(slide);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const slide = await HeroSlideService.create(req.body);
      res.status(201).json(slide);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const slide = await HeroSlideService.update(req.params.id, req.body);
      if (!slide) return res.status(404).json({ message: 'Slide not found' });
      res.json(slide);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const slide = await HeroSlideService.delete(req.params.id);
      if (!slide) return res.status(404).json({ message: 'Slide not found' });
      res.json({ message: 'Slide deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
