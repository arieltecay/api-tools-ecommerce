import StockMovement from '../../models/stock-movement/stock-movement.model';
import { IStockMovement } from '../../models/stock-movement/types';
import { FilterQuery, Types, ClientSession } from 'mongoose';
import { StockMovementFilters, PaginationOptions } from './types';

export const createStockMovement = async (data: Partial<IStockMovement>, options?: { session?: ClientSession }): Promise<IStockMovement> => {
  const movement = new StockMovement(data);
  return await movement.save(options);
};

export const getAllStockMovements = async (filters: StockMovementFilters = {}, options: PaginationOptions = {}): Promise<{ movements: IStockMovement[], total: number }> => {
  const { page = 1, limit = 20 } = options;
  const query: FilterQuery<IStockMovement> = {};
  if (filters.productId) {
    query['product._id'] = new Types.ObjectId(filters.productId);
  }
  if (filters.type) {
    query.type = filters.type;
  }

  const movements = await StockMovement.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await StockMovement.countDocuments(query);
  return { movements, total };
};
