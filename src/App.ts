import express from 'express';
import authRoutes from './routes/authRoutes';
import errorHandler from './ErrorHandling/ErrorHandler';

const App = (): express.Application => {
  const app = express();
  app.use(express.json());

  app.use('/api/auth', authRoutes);

  app.use(errorHandler);

  return app;
}

export default App;
