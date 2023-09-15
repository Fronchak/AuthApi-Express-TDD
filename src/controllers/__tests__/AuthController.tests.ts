import request from "supertest";
import express from 'express';
import App from "../../App";
import UserRegisterDTOBuilder from "../../builders/Auth/UserRegisterDTOBuilder";
import ValidationErrorResponse from "../../ErrorHandling/ValidationErrorResponse";
import { Sequelize } from "sequelize-typescript";
import path from "path";
import User from "../../models/User";
import { Op } from "sequelize";
import createAppConfig from "../../Config";
import TokenDTO from "../../dtos/auth/TokenDTO";

describe('AuthController', () => {

  let app: express.Application;

  beforeAll(async() => {
    const sequelize = new Sequelize({
      logging: false,
      database: 'auth_controller_tests',
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

    app = App(createAppConfig());
  })

  test('register should return unprocessable when email is null', async () => {
    const dto = UserRegisterDTOBuilder.aUserRegisterDTO().withANullEmail().build();
    const response = await request(app).post('/api/auth/register')
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
    const response = await request(app).post('/api/auth/register')
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
    const response = await request(app).post('/api/auth/register')
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
    const response = await request(app).post('/api/auth/register')
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
    const response = await request(app).post('/api/auth/register')
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
    const response = await request(app).post('/api/auth/register')
        .send(dto);

    expect(response.statusCode).toBe(422);
    const body = response.body as ValidationErrorResponse;
    expect(body).not.toBeNull();
    expect(body.message.length).toBeGreaterThan(0);
    expect(body.errors.some((e) => e.field === 'confirmPassword'));
    expect(await User.count()).toBe(0);
  });

  test('register should return unprocessable when email is already registered', async() => {
    const dto = UserRegisterDTOBuilder.aUserRegisterDTO().withARegisterEmail().build();
    const registerEmail = dto.email!;
    await User.create({
      email: registerEmail, password: '123'
    });

    const response = await request(app).post('/api/auth/register')
        .send(dto);

    expect(response.statusCode).toBe(422);
    const body = response.body as ValidationErrorResponse;
    expect(body).not.toBeNull();
    expect(body.message.length).toBeGreaterThan(0);
    const fieldError = body.errors.find((e) => e.field === 'email' && e.message === 'Email is already been used');
    expect(fieldError).not.toBeNull();
    expect(await User.count()).toBe(1);
  });

  test('register should save new user and return token when data is valid', async() => {
    const dto = UserRegisterDTOBuilder.aUserRegisterDTO().build();

    const response = await request(app).post('/api/auth/register')
        .send(dto);
    expect(response.statusCode).toBe(200);
    const user = await User.findOne({ where: { email: dto.email! } });
    expect(user).not.toBeNull();
    expect(user?.password).not.toBe(dto.password);
    expect(user?.password.length).toBeGreaterThan(30);
    const tokenDTO = response.body as TokenDTO;
    expect(tokenDTO).not.toBeNull();
    expect(tokenDTO.access_token.length).toBeGreaterThan(40);
  });
});
