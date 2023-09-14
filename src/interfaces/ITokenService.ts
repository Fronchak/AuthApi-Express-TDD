import UserEntity from "../entities/UserEntity";

interface ITokenService {

  generateToken(user: UserEntity): string;
}

export default ITokenService;
