import { AppConfig } from "./App";
import BCryptPasswordEncoder from "./components/BCryptPasswordEncoder";
import JWTTokenValidator from "./components/JWTTokenValidator";
import AuthController from "./controllers/AuthController";
import IAuthService from "./interfaces/IAuthService";
import IPasswordEncoder from "./interfaces/IPasswordEncoder";
import ITokenService from "./interfaces/ITokenService";
import ITokenValidator from "./interfaces/ITokenValidator";
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
  const tokenValidator: ITokenValidator = new JWTTokenValidator(userRepository);

  return {
    userRepository,
    authController,
    tokenValidator
  }
}

export default createAppConfig;
