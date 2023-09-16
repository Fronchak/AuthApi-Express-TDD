import request from "supertest";
import express from 'express';
import App from "../../App";
import path from "path";
import { Sequelize } from "sequelize-typescript";
import seedUsers, { userEmail, userPassword } from "../../seed/AuthSeed";
import Category from "../../models/Category";
import { Op } from "sequelize";
import CategoryInputDTOBuilder from "../../builders/Category/CategoryInputDTOBuilder";
import createAppConfig from "../../Config";
import LoginDTO from "../../dtos/auth/LoginDTO";
import TokenDTO from "../../dtos/auth/TokenDTO";
import ErrorResponse from "../../ErrorHandling/ErrorResponse";
import makeLogin from "../../tests/LoginUtil";

describe('CategoryController', () => {

  const AUTHORIZATION = 'authorization';
  const BEARER = 'Bearer';

  let app: express.Application;

  beforeAll(async() => {
    const sequelize = new Sequelize({
      logging: false,
      database: 'category_controller_tests',
      dialect: 'sqlite',
      username: 'root',
      password: '',
      storage: ':memory:',
      models: [path.join(__dirname, '..', '..', 'models')]
    });
    await sequelize.sync({ force: true });

    await seedUsers();
  });

  beforeEach(async () => {
    await Category.destroy({
      where: {
        id: {
          [Op.gte]: 1
        }
      }
    });

    app = App(createAppConfig());
  });

  const getUserToken = async() => {
    return makeLogin(userEmail, userPassword, app);
  }

  test('save should return unauthorized when user is not authenticated', async() => {
    const dto = CategoryInputDTOBuilder.aCategoryInputDTO().build();

    const response = await request(app).post('/api/categories')
        .send(dto);
    const body = response.body as ErrorResponse;

    expect(response.statusCode).toBe(401);
    expect(body).not.toBeNull();
    expect(body.message.length).toBeGreaterThan(0);
    expect(await Category.count()).toBe(0);
  });

  test('save should forbidden when a normal user is authenticated', async() => {
    const token = await getUserToken();

    const otherResponse = await request(app).post('/api/categories')
        .set(AUTHORIZATION, `${BEARER} ${token}`)
        .send({});

    expect(otherResponse.statusCode).toBe(403);
  });
});
