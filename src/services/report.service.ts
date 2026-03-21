import Order from '../models/order.model';
import Product from '../models/product.model';
import moment from 'moment';

export interface DashboardStats {
  revenue: number;
  orders: number;
  avgTicket: number;
  revenueGrowth: number;
  ordersGrowth: number;
  avgTicketGrowth: number;
  recentOrders: any[];
  topProducts: any[];
  topCategories: any[];
  topBrands: any[];
  paymentMethods: any[];
  orderStatusDistribution: any[];
}

export const getDashboardStats = async (startDateStr?: string, endDateStr?: string): Promise<DashboardStats> => {
  const endDate = endDateStr ? moment(endDateStr).endOf('day') : moment().endOf('day');
  const startDate = startDateStr ? moment(startDateStr).startOf('day') : moment().subtract(30, 'days').startOf('day');

  const diffDays = endDate.diff(startDate, 'days');
  const prevStartDate = moment(startDate).subtract(diffDays + 1, 'days').startOf('day');
  const prevEndDate = moment(startDate).subtract(1, 'days').endOf('day');

  // 1. KPIs
  const currentKpis = await Order.aggregate([
    { $match: { createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() }, status: { $ne: 'cancelled' } } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$pricing.total' },
        orderCount: { $sum: 1 },
        avgTicket: { $avg: '$pricing.total' }
      }
    }
  ]);

  const prevKpis = await Order.aggregate([
    { $match: { createdAt: { $gte: prevStartDate.toDate(), $lte: prevEndDate.toDate() }, status: { $ne: 'cancelled' } } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$pricing.total' },
        orderCount: { $sum: 1 },
        avgTicket: { $avg: '$pricing.total' }
      }
    }
  ]);

  const calculateGrowth = (current: number, previous: number) => {
    if (!previous || previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const currentRevenue = currentKpis[0]?.totalRevenue || 0;
  const currentOrders = currentKpis[0]?.orderCount || 0;
  const currentAvgTicket = currentKpis[0]?.avgTicket || 0;

  // 2. Top Categorías Simplificado (El nombre ya está en el producto)
  const topCategories = await Order.aggregate([
    { $match: { createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() }, status: { $ne: 'cancelled' } } },
    { $unwind: '$items' },
    {
      $lookup: {
        from: 'products',
        localField: 'items.product._id',
        foreignField: '_id',
        as: 'productData'
      }
    },
    { $unwind: '$productData' },
    {
      $group: {
        _id: '$productData.category.name',
        total: { $sum: '$items.subtotal' },
        quantity: { $sum: '$items.quantity' }
      }
    },
    { $sort: { total: -1 } },
    { $limit: 6 }
  ]);

  // 3. Top Productos
  const topProducts = await Order.aggregate([
    { $match: { createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() }, status: { $ne: 'cancelled' } } },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product.name',
        total: { $sum: '$items.subtotal' },
        quantity: { $sum: '$items.quantity' }
      }
    },
    { $sort: { quantity: -1 } },
    { $limit: 8 }
  ]);

  const statusDistribution = await Order.aggregate([
    { $match: { createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() } } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  const paymentMethods = await Order.aggregate([
    { $match: { createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() }, status: { $ne: 'cancelled' } } },
    { $group: { _id: '$payment.method', count: { $sum: 1 }, total: { $sum: '$pricing.total' } } }
  ]);

  const recentOrders = await Order.find({ createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() } })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  return {
    revenue: currentRevenue,
    orders: currentOrders,
    avgTicket: currentAvgTicket,
    revenueGrowth: calculateGrowth(currentRevenue, prevKpis[0]?.totalRevenue || 0),
    ordersGrowth: calculateGrowth(currentOrders, prevKpis[0]?.orderCount || 0),
    avgTicketGrowth: calculateGrowth(currentAvgTicket, prevKpis[0]?.avgTicket || 0),
    recentOrders,
    topProducts: topProducts.map(p => ({ name: p._id, total: p.total, quantity: p.quantity })),
    topCategories: topCategories.map(c => ({ name: c._id, total: c.total, quantity: c.quantity })),
    topBrands: [], 
    paymentMethods: paymentMethods.map(p => ({ method: p._id, count: p.count, total: p.total })),
    orderStatusDistribution: statusDistribution.map(s => ({ status: s._id, count: s.count }))
  };
};
