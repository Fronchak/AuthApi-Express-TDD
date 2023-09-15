import LoginDTO from "../dtos/auth/LoginDTO";
import TokenDTO from "../dtos/auth/TokenDTO";
import UserRegisterDTO from "../dtos/auth/UserRegisterDTO";
import UserEntity from "../entities/UserEntity";
import UnauthorizedError from "../error/UnauthorizedError";
import IPasswordEncoder from "../interfaces/IPasswordEncoder";
import ITokenService from "../interfaces/ITokenService";
import IUserRepository from "../interfaces/IUserRepository";


class AuthService {

  private readonly userRepository: IUserRepository;
  private readonly passwordEncoder: IPasswordEncoder;
  private readonly tokenService: ITokenService;

  constructor(userRepository: IUserRepository, passwordEncoder: IPasswordEncoder, tokenService: ITokenService) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.tokenService = tokenService;
  }

  register = async(userRegisterDTO: UserRegisterDTO): Promise<TokenDTO> => {
    const hashed = this.passwordEncoder.hash(userRegisterDTO.password!);
    const user: UserEntity = {
      id: null,
      email: userRegisterDTO.email!,
      password: hashed
    }
    const userSaved = await this.userRepository.save(user);
    const token = this.tokenService.generateToken(userSaved);
    return {
      access_token: token
    }
  }

  login = async(loginDTO: LoginDTO): Promise<TokenDTO> => {
    const user = await this.userRepository.findByEmail(loginDTO.email!);
    if(!user) {
      throw new UnauthorizedError();
    }
    const passwordMatch = this.passwordEncoder.passwordMatch(loginDTO.password!, user.password);
    if(!passwordMatch) {
      throw new UnauthorizedError();
    }
    const token = this.tokenService.generateToken(user);
    return {
      access_token: token
    };
  }
}

export default AuthService;
