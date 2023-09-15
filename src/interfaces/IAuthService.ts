import LoginDTO from "../dtos/auth/LoginDTO";
import TokenDTO from "../dtos/auth/TokenDTO";
import UserRegisterDTO from "../dtos/auth/UserRegisterDTO";

interface IAuthService {

  register(userRegisterDTO: UserRegisterDTO): Promise<TokenDTO>;

  login(loginDTO: LoginDTO): Promise<TokenDTO>
}

export default IAuthService;
