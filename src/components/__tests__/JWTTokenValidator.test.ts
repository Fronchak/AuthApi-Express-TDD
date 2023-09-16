import UserEntity from "../../entities/UserEntity";
import IUserRepository from "../../interfaces/IUserRepository";
import JWTTokenValidator from "../JWTTokenValidator";
import jwt from 'jsonwebtoken';

describe('JWTTokenValidator', () => {

  let tokenValidator: JWTTokenValidator;
  let userRepository: jest.Mocked<IUserRepository>;

  const existingId = 1;
  const nonExistingId = 2;
  let user: UserEntity;

  beforeEach(() => {
    user = {
      id: existingId,
      email: 'user@gmail.com',
      password: '123',
      roles: [
        { id: 1, name: 'admin' }
      ]
    }
    userRepository = {
      findById: jest.fn(async(id) => {
        if(id === existingId) return user;
        return null;
      }),
      findByEmail: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }
    tokenValidator = new JWTTokenValidator(userRepository);
  });

  test('validateToken should return null when token is undefired', async () => {
    const result = await tokenValidator.validateToken(undefined);

    expect(result).toBeNull();
  })

  test('validateToken should return null when token does not begin with Bearer', async() => {
    const result = await tokenValidator.validateToken('Invalid token');

    expect(result).toBeNull();
  });

  test('validateToken should return null when token is expired', async() => {
    const token = jwt.sign(
      {},
      process.env.ACCESS_TOKEN_SECRET || 'PtkbmVGpt5FliOrhHWAmuQR1k85mmGr2CTi2C8Yy4Zlx8dzLALaPCFx5X5pQE5B6',
      { expiresIn: '-1h' }
    );
    const result = await tokenValidator.validateToken(`Bearer ${token}`);

    expect(result).toBeNull();
  });

  test('validateToken should return null when user id does not exist', async() => {
    const token = jwt.sign(
      {
        id: nonExistingId
      },
      process.env.ACCESS_TOKEN_SECRET || 'PtkbmVGpt5FliOrhHWAmuQR1k85mmGr2CTi2C8Yy4Zlx8dzLALaPCFx5X5pQE5B6',
      { expiresIn: '1d' }
    );

    const result = await tokenValidator.validateToken(`Bearer ${token}`);

    expect(result).toBeNull();
    expect(userRepository.findById).toHaveBeenCalledWith(nonExistingId);
  });

  test('validateToken should return user when id exists', async() => {
    const token = jwt.sign(
      {
        id: existingId
      },
      process.env.ACCESS_TOKEN_SECRET || 'PtkbmVGpt5FliOrhHWAmuQR1k85mmGr2CTi2C8Yy4Zlx8dzLALaPCFx5X5pQE5B6',
      { expiresIn: '1d' }
    );

    const result = await tokenValidator.validateToken(`Bearer ${token}`);

    expect(result).toBe(user);
    expect(userRepository.findById).toHaveBeenCalledWith(existingId);
  });
});
