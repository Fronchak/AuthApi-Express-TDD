import UserEntity from "../../entities/UserEntity";
import JWTTokenService from "../JWTTokenService";

describe('JWTTokenService', () => {

  const tokenService: JWTTokenService = new JWTTokenService();

  test('generateToken should return the token', () => {
    const user: UserEntity = {
      id: 1,
      email: 'mail@gmail.com',
      password: '123',
      roles: [
        {
          id: 1, name: 'admin'
        },
        {
          id: 2, name: 'worker'
        }
      ]
    }

    const result = tokenService.generateToken(user);

    expect(result).not.toBeNull();
    expect(result.length).toBeGreaterThan(40);
  });
});
