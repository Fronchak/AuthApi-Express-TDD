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
      process.env.ACCESS_TOKEN_SECRET || '123',
      { expiresIn: '1d' }
    );
    return accessToken;
  }
}

export default JWTTokenService;
