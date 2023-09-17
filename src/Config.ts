import { AppConfig } from "./App";
import BCryptPasswordEncoder from "./components/BCryptPasswordEncoder";
import JWTTokenValidator from "./components/JWTTokenValidator";
import AuthController from "./controllers/AuthController";
import CategoryController from "./controllers/CategoryController";
import IAuthService from "./interfaces/IAuthService";
import ICategoryMapper from "./interfaces/ICategoryMapper";
import ICategoryRepository from "./interfaces/ICategoryRepository";
import ICategoryService from "./interfaces/ICategoryService";
import IPasswordEncoder from "./interfaces/IPasswordEncoder";
import ITokenService from "./interfaces/ITokenService";
import ITokenValidator from "./interfaces/ITokenValidator";
import IUserRepository from "./interfaces/IUserRepository";
import CategoryMapper from "./mappers/CategoryMapper";
import CategoryRepository from "./repositories/CategoryRepository";
import UserRepository from "./repositories/UserRepository";
import AuthService from "./services/AuthService";
import CategoryService from "./services/CategoryService";
import JWTTokenService from "./services/JWTTokenService";

const createAppConfig = (): AppConfig => {

  const userRepository: IUserRepository = new UserRepository();
  const passwordEncoder: IPasswordEncoder = new BCryptPasswordEncoder();
  const tokenService: ITokenService = new JWTTokenService();
  const authService: IAuthService = new AuthService(userRepository, passwordEncoder, tokenService);
  const authController: AuthController = new AuthController(authService);
  const tokenValidator: ITokenValidator = new JWTTokenValidator(userRepository);

  const categoryRepository: ICategoryRepository = new CategoryRepository();
  const categoryMapper: ICategoryMapper = new CategoryMapper();
  const categoryService: ICategoryService = new CategoryService(categoryRepository, categoryMapper);
  const categoryController: CategoryController = new CategoryController(categoryService);

  return {
    userRepository,
    authController,
    tokenValidator,
    categoryController,
    categoryRepository
  }
}

export default createAppConfig;
