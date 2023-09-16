import request from "supertest";
import express from 'express';
import App from "../../App";
import path from "path";
import { Sequelize } from "sequelize-typescript";
import seedUsers from "../../seed/AuthSeed";
import Category from "../../models/Category";
import { Op } from "sequelize";
import CategoryInputDTOBuilder from "../../builders/Category/CategoryInputDTOBuilder";
import createAppConfig from "../../Config";

describe('CategoryController', () => {

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

  test('save should return unauthorized when user is not authenticated', async() => {
    const dto = CategoryInputDTOBuilder.aCategoryInputDTO().build();

    const response = await request(app).post('/api/categories')
        .send(dto);

    expect(response.statusCode).toBe(401);
  });
});
