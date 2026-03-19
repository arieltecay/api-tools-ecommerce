import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db';
import dotenv from 'dotenv';

// Import Routes
import authRoutes from './routes/auth.routes';
import categoryRoutes from './routes/category.routes';
import brandRoutes from './routes/brand.routes';
import productRoutes from './routes/product.routes';
import customerRoutes from './routes/customer.routes';
import orderRoutes from './routes/order.routes';
import supplierRoutes from './routes/supplier.routes';
import purchaseInvoiceRoutes from './routes/purchase-invoice.routes';
import stockMovementRoutes from './routes/stock-movement.routes';
import discountCodeRoutes from './routes/discount-code.routes';
import settingsRoutes from './routes/settings.routes';
import reportRoutes from './routes/report.routes';
import paymentRoutes from './routes/payment.routes';
import importRoutes from './routes/import.routes';

dotenv.config();

const app: Express = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database
connectDB();

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/brands', brandRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/suppliers', supplierRoutes);
app.use('/api/v1/purchase-invoices', purchaseInvoiceRoutes);
app.use('/api/v1/stock-movements', stockMovementRoutes);
app.use('/api/v1/discount-codes', discountCodeRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/import', importRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

export default app;
