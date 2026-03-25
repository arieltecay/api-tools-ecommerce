import Order from '../../models/order/order.model';
import Product from '../../models/product/product.model';
import moment from 'moment';
import { IOrder, IOrderStatus, IPaymentMethod } from '../../models/order/types';
import { AggregationResult, TopItem, PaymentMethodSummary, OrderStatusDistribution, DashboardStats } from './types';

export const getDashboardStats = async (startDateStr?: string, endDateStr?: string): Promise<DashboardStats> => {
  const endDate = endDateStr ? moment(endDateStr).endOf('day') : moment().endOf('day');
  const startDate = startDateStr ? moment(startDateStr).startOf('day') : moment().subtract(30, 'days').startOf('day');

  const diffDays = endDate.diff(startDate, 'days');
  const prevStartDate = moment(startDate).subtract(diffDays + 1, 'days').startOf('day');
  const prevEndDate = moment(startDate).subtract(1, 'days').endOf('day');

  // 1. KPIs
  const kpiAggregation = (start: moment.Moment, end: moment.Moment) => ([
    { $match: { createdAt: { $gte: start.toDate(), $lte: end.toDate() }, status: { $ne: 'cancelled' } } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$pricing.total' },
        orderCount: { $sum: 1 },
        avgTicket: { $avg: '$pricing.total' }
      }
    }
  ]);
  
  const currentKpis = await Order.aggregate<{ _id: null; totalRevenue: number; orderCount: number; avgTicket: number; }>(kpiAggregation(startDate, endDate));
  const prevKpis = await Order.aggregate<{ _id: null; totalRevenue: number; orderCount: number; avgTicket: number; }>(kpiAggregation(prevStartDate, prevEndDate));

  const calculateGrowth = (current: number, previous: number): number => {
    if (!previous || previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const currentRevenue = currentKpis[0]?.totalRevenue || 0;
  const currentOrders = currentKpis[0]?.orderCount || 0;
  const currentAvgTicket = currentKpis[0]?.avgTicket || 0;

  // 2. Top Categorías
  const topCategories: AggregationResult[] = await Order.aggregate([
    { $match: { createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() }, status: { $ne: 'cancelled' } } },
    { $unwind: '$items' },
    { $lookup: { from: 'products', localField: 'items.product._id', foreignField: '_id', as: 'productData' } },
    { $unwind: '$productData' },
    { $group: { _id: '$productData.category.name', total: { $sum: '$items.subtotal' }, quantity: { $sum: '$items.quantity' } } },
    { $sort: { total: -1 } },
    { $limit: 6 }
  ]);

  // 3. Top Productos
  const topProducts: AggregationResult[] = await Order.aggregate([
    { $match: { createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() }, status: { $ne: 'cancelled' } } },
    { $unwind: '$items' },
    { $group: { _id: '$items.product.name', total: { $sum: '$items.subtotal' }, quantity: { $sum: '$items.quantity' } } },
    { $sort: { quantity: -1 } },
    { $limit: 8 }
  ]);

  const statusDistribution: AggregationResult[] = await Order.aggregate([
    { $match: { createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() } } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  const paymentMethods: AggregationResult[] = await Order.aggregate([
    { $match: { createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() }, status: { $ne: 'cancelled' } } },
    { $group: { _id: '$payment.method', count: { $sum: 1 }, total: { $sum: '$pricing.total' } } }
  ]);

  const recentOrders = await Order.find({ createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() } })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean() as any as IOrder[];

  return {
    revenue: currentRevenue,
    orders: currentOrders,
    avgTicket: currentAvgTicket,
    revenueGrowth: calculateGrowth(currentRevenue, prevKpis[0]?.totalRevenue || 0),
    ordersGrowth: calculateGrowth(currentOrders, prevKpis[0]?.orderCount || 0),
    avgTicketGrowth: calculateGrowth(currentAvgTicket, prevKpis[0]?.avgTicket || 0),
    recentOrders,
    topProducts: topProducts.map(p => ({ name: String(p._id), total: Number(p.total), quantity: Number(p.quantity) })),
    topCategories: topCategories.map(c => ({ name: String(c._id), total: Number(c.total), quantity: Number(c.quantity) })),
    topBrands: [], 
    paymentMethods: paymentMethods.map(p => ({ method: p._id as IPaymentMethod, count: Number(p.count), total: Number(p.total) })),
    orderStatusDistribution: statusDistribution.map(s => ({ status: s._id as IOrderStatus, count: Number(s.count) }))
  };
};
