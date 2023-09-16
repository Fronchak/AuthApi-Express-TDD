import jwt from 'jsonwebtoken';
import UserEntity from "../entities/UserEntity";
import ITokenService from "../interfaces/ITokenService";

class JWTTokenService implements ITokenService {

  generateToken(user: UserEntity): string {
    const accessToken = jwt.sign(
      {
        id: user.id,
        username: user.email,
        roles: user.roles.map((r) => r.name)
      },
      process.env.ACCESS_TOKEN_SECRET || 'PtkbmVGpt5FliOrhHWAmuQR1k85mmGr2CTi2C8Yy4Zlx8dzLALaPCFx5X5pQE5B6',
      { expiresIn: '1d' }
    );
    return accessToken;
  }
}

export default JWTTokenService;
