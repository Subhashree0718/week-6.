// import express from 'express';
// import cors from 'cors';
// import { config } from './config/env.js';
// import { logger } from './utils/logger.js';
// import { errorHandler, notFound } from './middleware/error.js';

// // Routes
// import authRoutes from './modules/auth/auth.routes.js';
// import teamRoutes from './modules/teams/routes.js';
// import objectiveRoutes from './modules/objectives/routes.js';
// import keyResultRoutes from './modules/keyresults/routes.js';
// import updateRoutes from './modules/updates/routes.js';

// const app = express();

// // Middleware
// app.use(cors({
//   origin: config.cors.origin,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   credentials: true,
// }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Request logging
// app.use((req, res, next) => {
//   logger.http(`${req.method} ${req.path}`);
//   next();
// });

// // Health check
// app.get('/health', (req, res) => {
//   res.json({
//     success: true,
//     message: 'Server is running',
//     timestamp: new Date().toISOString(),
//   });
// });

// // API Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/teams', teamRoutes);
// app.use('/api/objectives', objectiveRoutes);
// app.use('/api', keyResultRoutes);
// app.use('/api/updates', updateRoutes);

// // Error handling
// app.use(notFound);
// app.use(errorHandler);

// export default app;
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { logger } from './utils/logger.js';
import { errorHandler, notFound } from './middleware/error.js';

import authRoutes from './modules/auth/auth.routes.js';
import teamRoutes from './modules/teams/routes.js';
import objectiveRoutes from './modules/objectives/routes.js';
import keyResultRoutes from './modules/keyresults/routes.js';
import updateRoutes from './modules/updates/routes.js';

dotenv.config();

const app = express();

const FRONTEND_URL = 'http://okr-tracker-frontend-dev.s3-website-us-east-1.amazonaws.com';

app.use(
  cors({
    origin: FRONTEND_URL, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.options('*', cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  logger.http(`${req.method} ${req.path}`);
  next();
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running fine',
    frontendAllowed: FRONTEND_URL,
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/objectives', objectiveRoutes);
app.use('/api', keyResultRoutes);
app.use('/api/updates', updateRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
