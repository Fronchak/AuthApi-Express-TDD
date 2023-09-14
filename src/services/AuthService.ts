import TokenDTO from "../dtos/auth/TokenDTO";
import UserRegisterDTO from "../dtos/auth/UserRegisterDTO";
import UserEntity from "../entities/UserEntity";
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
}

export default AuthService;
