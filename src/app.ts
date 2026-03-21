import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db';

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
import whatsappRoutes from './routes/whatsapp.routes';

const app: Express = express();

// Configurar CORS
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',') 
  : ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir peticiones sin origen (como apps móviles o curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('CORS Policy: Origin not allowed'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Middleware de conexión a DB (Serverless friendly)
app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: 'Database connection error' });
  }
});

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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
app.use('/api/v1/whatsapp', whatsappRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date(), env: process.env.NODE_ENV });
});

export default app;
