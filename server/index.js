// Express.js Backend Entry Point
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import securityMiddleware from './config/security.js';
import faceRecognitionRoutes from './routes/faceRecognitionRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Security middleware
securityMiddleware(app);

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/face-recognition', faceRecognitionRoutes);

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});