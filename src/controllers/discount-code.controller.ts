import { Request, Response } from 'express';
import * as discountCodeService from '../services/discount-code.service';
import { RequestWithUser } from '../middleware/auth.middleware';

export const validate = async (req: Request, res: Response) => {
  try {
    const { code, email, orderAmount } = req.body;
    const result = await discountCodeService.validateDiscountCode(code, email, orderAmount);
    res.status(result.isValid ? 200 : 400).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error validating code';
    res.status(500).json({ message });
  }
};

export const create = async (req: RequestWithUser, res: Response) => {
  try {
    const userId = req.user?._id || '';
    const discountCode = await discountCodeService.createDiscountCode(req.body, userId);
    res.status(201).json(discountCode);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error creating code';
    res.status(400).json({ message });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const codes = await discountCodeService.getAllDiscountCodes();
    res.json(codes);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error fetching codes';
    res.status(500).json({ message });
  }
};
