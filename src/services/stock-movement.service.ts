import StockMovement from '../models/stock-movement.model';
import { IStockMovement } from '../models/types';

export const createStockMovement = async (data: Partial<IStockMovement>): Promise<IStockMovement> => {
  const movement = new StockMovement(data);
  return await movement.save();
};

export const getAllStockMovements = async (filters: any = {}, options: any = {}): Promise<{ movements: IStockMovement[], total: number }> => {
  const { page = 1, limit = 20 } = options;
  const query: any = {};
  if (filters.productId) query['product._id'] = filters.productId;
  if (filters.type) query.type = filters.type;

  const movements = await StockMovement.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await StockMovement.countDocuments(query);
  return { movements, total };
};
