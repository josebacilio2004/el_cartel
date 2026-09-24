import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { queueRouter } from './routes/queue.routes';
import { barberRouter } from './routes/barber.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  if (req.path !== '/api/queue/stream') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  }
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Barber Pro Queue Manager API',
    timestamp: new Date().toISOString()
  });
});

// Rutas de la API
app.use('/api/queue', queueRouter);
app.use('/api/barbers', barberRouter);

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` Barber Pro Queue Core API`);
  console.log(` Running on: http://localhost:${PORT}`);
  console.log(` Healthcheck: http://localhost:${PORT}/health`);
  console.log(` SSE Stream: http://localhost:${PORT}/api/queue/stream`);
  console.log(`===============================================`);
});
