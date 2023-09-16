import jwt, { JwtPayload } from 'jsonwebtoken';
import UserEntity from "../entities/UserEntity";
import ITokenValidator from "../interfaces/ITokenValidator";
import IUserRepository from '../interfaces/IUserRepository';

class JWTTokenValidator implements ITokenValidator {

  private readonly userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async validateToken(accessToken: string | undefined): Promise<UserEntity | null> {
    if(accessToken === undefined) return null;
    if(!accessToken.startsWith('Bearer ')) return null;
    const token = accessToken.substring(7);
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'PtkbmVGpt5FliOrhHWAmuQR1k85mmGr2CTi2C8Yy4Zlx8dzLALaPCFx5X5pQE5B6') as JwtPayload;
      const userId = decoded.id as number;
      const user = await this.userRepository.findById(userId);
      return user;
    }
    catch(e) {
      return null;
    }
  }
}

export default JWTTokenValidator;
