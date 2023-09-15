import express from 'express';
import authRoutes from './routes/authRoutes';

const App = (): express.Application => {
  const app = express();
  app.use(express.json());

  app.use('/api/auth', authRoutes);

  return app;
}

export default App;
