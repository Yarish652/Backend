import express from 'express';
import connectDB from './db/index.js';

const app = express();

// Middleware
app.use(express.json());

// Example route
app.get('/', (req, res) => res.send('API is running'));

// Connect to DB, then start server
connectDB().then(() => {
  app.listen(8000, () => {
    console.log('Server is running at port : 8000');
  });
});