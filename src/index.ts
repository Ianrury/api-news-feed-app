import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';
import followRoutes from './routes/followRoutes';
import serverless from 'serverless-http';

dotenv.config();

const app = express();

// CORS configuration for production
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL || ''
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api', postRoutes);
app.use('/api', followRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running', timestamp: new Date() });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'News Feed API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/register, /api/login',
      posts: '/api/posts, /api/feed',
      follow: '/api/users, /api/follow/:userid'
    }
  });
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}
const handler = serverless(app);
export default handler;