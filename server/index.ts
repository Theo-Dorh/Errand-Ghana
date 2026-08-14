import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import demandListsRouter from './routes/demandLists.ts';
import offersRouter from './routes/offers.ts';
import ordersRouter from './routes/orders.ts';
import escrowRouter from './routes/escrow.ts';
import adminRouter from './routes/admin.ts';
import mlRouter from './routes/ml.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// API Request Logger
app.use((req, _res, next) => {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/demand-lists', demandListsRouter);
app.use('/api/offers', offersRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/escrow', escrowRouter);
app.use('/api/admin', adminRouter);
app.use('/api/ml', mlRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    project: 'ERRAND GHANA',
    developer: 'Theophilus Dorh (22425676)',
    course: 'CSCD 602 - Advanced Software Engineering (University of Ghana)',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    escrow_engine: '2PC_DISTRIBUTED_SAGA_ACTIVE',
  });
});

app.listen(PORT, () => {
  console.log(`=============================================================`);
  console.log(`🇬🇭 ERRAND GHANA API SERVER & 2PC ESCROW ENGINE RUNNING`);
  console.log(`🚀 Port: http://localhost:${PORT}`);
  console.log(`👨‍💻 Developer: Theophilus Dorh (Student ID: 22425676)`);
  console.log(`🏛️ Course: CSCD 602 - Advanced Software Engineering, UG Legon`);
  console.log(`=============================================================`);
});

export default app;
