import { raw } from "express";
import UserBuilder from "../../builders/User/UserBuilder";
import UserRegisterDTO from "../../dtos/auth/UserRegisterDTO";
import IPasswordEncoder from "../../interfaces/IPasswordEncoder";
import ITokenService from "../../interfaces/ITokenService";
import IUserRepository from "../../interfaces/IUserRepository";
import AuthService from "../AuthService";
import LoginDTO from "../../dtos/auth/LoginDTO";
import UnauthorizedError from "../../error/UnauthorizedError";
import UserEntity from "../../entities/UserEntity";

describe('AuthServices', () => {

  let userRepository: jest.Mocked<IUserRepository>;
  let passwordEncoder: jest.Mocked<IPasswordEncoder>;
  let tokenService: jest.Mocked<ITokenService>;
  let authService: AuthService;

  beforeEach(() => {
    userRepository = {
      save: jest.fn(),
      findByEmail: jest.fn()
    };
    passwordEncoder = {
      hash: jest.fn(),
      passwordMatch: jest.fn()
    };
    tokenService = {
      generateToken: jest.fn()
    };
    authService = new AuthService(userRepository, passwordEncoder, tokenService);
  });

  test('register should save user with a hashed password and return its token', async () => {
    const email = "mail@gmail.com";
    const rawPassword = "1234";
    const hashed = "hashed";
    const userRegisterDTO: UserRegisterDTO = {
      email,
      password: rawPassword,
      confirmPassword: rawPassword
    };
    const token: string = "token";
    const user = UserBuilder.aUser().build();
    passwordEncoder.hash.mockReturnValue(hashed);
    userRepository.save.mockResolvedValue(user);
    tokenService.generateToken.mockReturnValue(token);

    const result = await authService.register(userRegisterDTO);

    expect(result.access_token).toBe(token);
    expect(passwordEncoder.hash).toHaveBeenCalledWith(rawPassword);
    expect(userRepository.save).toHaveBeenCalledTimes(1);
    expect(userRepository.save).toHaveBeenCalledWith({
      id: null,
      email: email,
      password: hashed
    });
    expect(tokenService.generateToken).toHaveBeenCalledWith(user);
  });

  test('login should throws UnauthorizedError when email does not exists', async () => {
    const email = "mail@gmail.com";
    const loginDTO: LoginDTO = {
      email,
      password: ''
    }
    userRepository.findByEmail.mockResolvedValue(null);

    expect.assertions(2);
    try {
      await authService.login(loginDTO);
    }
    catch(e) {
      expect(e).toBeInstanceOf(UnauthorizedError)
    }
    expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
  });

  test('login should throws UnauthorizedError when password is wrong', async() => {
    const email = "mail@gmail.com";
    const password = "123";
    const loginDTO: LoginDTO = {
      email,
      password
    }
    const user: UserEntity = UserBuilder.aUser().build();
    userRepository.findByEmail.mockResolvedValue(user);
    passwordEncoder.passwordMatch.mockReturnValue(false);

    expect.assertions(2);
    try {
      await authService.login(loginDTO);
    }
    catch(e) {
      expect(e).toBeInstanceOf(UnauthorizedError);
    }
    expect(passwordEncoder.passwordMatch).toHaveBeenCalledWith(password, user.password);
  });

  test('login should return token when password is correct', async () => {
    const email = "mail@gmail.com";
    const password = "123";
    const loginDTO: LoginDTO = {
      email,
      password
    }
    const user: UserEntity = UserBuilder.aUser().build();
    userRepository.findByEmail.mockResolvedValue(user);
    passwordEncoder.passwordMatch.mockReturnValue(true);
    const token = "token";
    tokenService.generateToken.mockReturnValue(token);

    const result = await authService.login(loginDTO);

    expect(result.access_token).toBe(token);
    expect(tokenService.generateToken).toBeCalledWith(user);
  })
});
