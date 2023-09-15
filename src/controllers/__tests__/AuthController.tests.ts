import request from "supertest";
import App from "../../App";
import UserRegisterDTOBuilder from "../../builders/Auth/UserRegisterDTOBuilder";
import ValidationErrorResponse from "../../ErrorHandling/ValidationErrorResponse";
import { Sequelize } from "sequelize-typescript";
import path from "path";
import User from "../../models/User";
import { Op } from "sequelize";

describe('AuthController', () => {

  beforeAll(async() => {
    const sequelize = new Sequelize({
      logging: false,
      database: 'tests',
      dialect: 'sqlite',
      username: 'root',
      password: '',
      storage: ':memory:',
      models: [path.join(__dirname, '..', '..', 'models')]
    });
    await sequelize.sync({ force: true });
  });

  beforeEach(async() => {
    User.destroy({
      where: {
        id: {
          [Op.gte]: 1
        }
      }
    });
  })

  test('register should return unprocessable when email is null', async () => {
    const dto = UserRegisterDTOBuilder.aUserRegisterDTO().withANullEmail().build();
    const response = await request(App()).post('/api/auth/register')
        .send(dto);

    expect(response.statusCode).toBe(422);
    const body = response.body as ValidationErrorResponse;
    expect(body).not.toBeNull();
    expect(body.message.length).toBeGreaterThan(0);
    expect(body.errors.some((e) => e.field === 'email'));
    expect(await User.count()).toBe(0);
  });

  test('register should return unprocessable when email is blank', async () => {
    const dto = UserRegisterDTOBuilder.aUserRegisterDTO().withABlankEmail().build();
    const response = await request(App()).post('/api/auth/register')
        .send(dto);

    expect(response.statusCode).toBe(422);
    const body = response.body as ValidationErrorResponse;
    expect(body).not.toBeNull();
    expect(body.message.length).toBeGreaterThan(0);
    expect(body.errors.some((e) => e.field === 'email'));
    expect(await User.count()).toBe(0);
  });

  test('register should return unprocessable when email is invalid', async () => {
    const dto = UserRegisterDTOBuilder.aUserRegisterDTO().withAnInvalidEmail().build();
    const response = await request(App()).post('/api/auth/register')
        .send(dto);

    expect(response.statusCode).toBe(422);
    const body = response.body as ValidationErrorResponse;
    expect(body).not.toBeNull();
    expect(body.message.length).toBeGreaterThan(0);
    expect(body.errors.some((e) => e.field === 'email'));
    expect(await User.count()).toBe(0);
  });

  test('register should return unprocessable when password is null', async() => {
    const dto = UserRegisterDTOBuilder.aUserRegisterDTO().withANullPassword().build();
    const response = await request(App()).post('/api/auth/register')
        .send(dto);

    expect(response.statusCode).toBe(422);
    const body = response.body as ValidationErrorResponse;
    expect(body).not.toBeNull();
    expect(body.message.length).toBeGreaterThan(0);
    expect(body.errors.some((e) => e.field === 'password'));
    expect(await User.count()).toBe(0);
  });

  test('register should return unprocessable when password is too short', async() => {
    const dto = UserRegisterDTOBuilder.aUserRegisterDTO().withAShortPassword().build();
    const response = await request(App()).post('/api/auth/register')
        .send(dto);

    expect(response.statusCode).toBe(422);
    const body = response.body as ValidationErrorResponse;
    expect(body).not.toBeNull();
    expect(body.message.length).toBeGreaterThan(0);
    expect(body.errors.some((e) => e.field === 'password'));
    expect(await User.count()).toBe(0);
  });

  test('register should return unprocessable when confirmPassword is different', async() => {
    const dto = UserRegisterDTOBuilder.aUserRegisterDTO().withADifferentConfirmPassword().build();
    const response = await request(App()).post('/api/auth/register')
        .send(dto);

    expect(response.statusCode).toBe(422);
    const body = response.body as ValidationErrorResponse;
    expect(body).not.toBeNull();
    expect(body.message.length).toBeGreaterThan(0);
    expect(body.errors.some((e) => e.field === 'confirmPassword'));
    expect(await User.count()).toBe(0);
  });
});
