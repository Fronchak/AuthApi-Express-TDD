import express from 'express';
import authRoutes from './routes/authRoutes';
import errorHandler from './ErrorHandling/ErrorHandler';
import IUserRepository from './interfaces/IUserRepository';
import AuthController from './controllers/AuthController';

export type AppConfig = {
  userRepository: IUserRepository,
  authController: AuthController
}

const App = (config: AppConfig): express.Application => {
  const app = express();
  app.use(express.json());

  app.use('/api/auth', authRoutes(config.userRepository, config.authController));

  app.use(errorHandler);

  return app;
}

export default App;
