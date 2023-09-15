import { AppConfig } from "./App";
import BCryptPasswordEncoder from "./components/BCryptPasswordEncoder";
import AuthController from "./controllers/AuthController";
import IAuthService from "./interfaces/IAuthService";
import IPasswordEncoder from "./interfaces/IPasswordEncoder";
import ITokenService from "./interfaces/ITokenService";
import IUserRepository from "./interfaces/IUserRepository";
import UserRepository from "./repositories/UserRepository";
import AuthService from "./services/AuthService";
import JWTTokenService from "./services/JWTTokenService";

const createAppConfig = (): AppConfig => {

  const userRepository: IUserRepository = new UserRepository();
  const passwordEncoder: IPasswordEncoder = new BCryptPasswordEncoder();
  const tokenService: ITokenService = new JWTTokenService();
  const authService: IAuthService = new AuthService(userRepository, passwordEncoder, tokenService);
  const authController: AuthController = new AuthController(authService);

  return {
    userRepository,
    authController
  }
}

export default createAppConfig;
