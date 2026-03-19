import Order from '../models/order.model';
import Product from '../models/product.model';
import Customer from '../models/customer.model';
import moment from 'moment';

export interface SalesByDay {
  date: string;
  total: number;
  count: number;
}

export interface TopCategory {
  name: string;
  total: number;
  quantity: number;
}

export interface DashboardStats {
  revenue: number;
  orders: number;
  avgTicket: number;
  newCustomers: number;
  lowStockAlerts: number;
  recentOrders: any[]; // Order documents are complex, could use IOrder[] but might need lean objects
  salesByDay: SalesByDay[];
  topCategories: TopCategory[];
}

export const getDashboardStats = async (period: string = '30days'): Promise<DashboardStats> => {
  let startDate: moment.Moment;
  if (period === 'today') startDate = moment().startOf('day');
  else if (period === '7days') startDate = moment().subtract(7, 'days').startOf('day');
  else startDate = moment().subtract(30, 'days').startOf('day');

  const salesStats = await Order.aggregate([
    { $match: { createdAt: { $gte: startDate.toDate() }, status: { $ne: 'cancelled' } } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$pricing.total' },
        orderCount: { $sum: 1 },
        avgTicket: { $avg: '$pricing.total' }
      }
    }
  ]);

  const newCustomers = await Customer.countDocuments({ createdAt: { $gte: startDate.toDate() } });
  const lowStockProducts = await Product.countDocuments({ stock: { $lte: 5 }, status: 'active' });
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  // 1. Sales by Day
  const salesByDayResult = await Order.aggregate([
    { $match: { createdAt: { $gte: startDate.toDate() }, status: { $ne: 'cancelled' } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        total: { $sum: '$pricing.total' },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // 2. Top Categories
  const topCategoriesResult = await Order.aggregate([
    { $match: { createdAt: { $gte: startDate.toDate() }, status: { $ne: 'cancelled' } } },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product.category.name',
        total: { $sum: '$items.subtotal' },
        quantity: { $sum: '$items.quantity' }
      }
    },
    { $sort: { total: -1 } },
    { $limit: 5 }
  ]);

  return {
    revenue: salesStats[0]?.totalRevenue || 0,
    orders: salesStats[0]?.orderCount || 0,
    avgTicket: salesStats[0]?.avgTicket || 0,
    newCustomers,
    lowStockAlerts: lowStockProducts,
    recentOrders,
    salesByDay: salesByDayResult.map(day => ({ 
      date: String(day._id), 
      total: Number(day.total), 
      count: Number(day.count) 
    })),
    topCategories: topCategoriesResult.map(cat => ({ 
      name: String(cat._id), 
      total: Number(cat.total), 
      quantity: Number(cat.quantity) 
    }))
  };
};
