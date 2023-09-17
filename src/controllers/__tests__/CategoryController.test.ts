import request from "supertest";
import express from 'express';
import App from "../../App";
import path from "path";
import { Sequelize } from "sequelize-typescript";
import seedUsers, { adminEmail, adminPassword, userEmail, userPassword, workerEmail, workerPassword } from "../../seed/AuthSeed";
import Category from "../../models/Category";
import { Op } from "sequelize";
import CategoryInputDTOBuilder from "../../builders/Category/CategoryInputDTOBuilder";
import createAppConfig from "../../Config";
import ErrorResponse from "../../ErrorHandling/ErrorResponse";
import makeLogin from "../../tests/LoginUtil";
import CategoryEntity from "../../entities/CategoryEntity";
import CategoryBuilder from "../../builders/Category/CategoryBuilder";
import CategoryDTO from "../../dtos/category/CategoryDTO";
import ValidationErrorResponse from "../../ErrorHandling/ValidationErrorResponse";
import CategoryInputDTO from "../../dtos/category/CategoryInputDTO";

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

  const getWorkerToken = async() => {
    return makeLogin(workerEmail, workerPassword, app);
  }

  const getAdminToken = async() => {
    return makeLogin(adminEmail, adminPassword, app);
  }

  test('findById should return BadRequest when id is not a number', async() => {
    const response = await request(app).get('/api/categories/A');
    const body = response.body as ErrorResponse;

    expect(response.statusCode).toBe(400);
    expect(body).not.toBeNull();
    expect(body.message.length).toBeGreaterThan(0);
  });

  test('findById should return NotFound when id does not exist', async() => {
    const response = await request(app).get('/api/categories/1');
    const body = response.body as ErrorResponse;

    expect(response.statusCode).toBe(404);
    expect(body).not.toBeNull();
    expect(body.message.length).toBeGreaterThan(0);
  });

  test('findById should return categoryDTO when id exists', async() => {
    const category: CategoryEntity = CategoryBuilder.aCategory().build();
    const id: number = category.id!;
    await Category.create({ id, name: category.name });

    const response = await request(app).get(`/api/categories/${id}`);
    const body = response.body as CategoryDTO;

    expect(response.statusCode).toBe(200);
    expect(body).not.toBeNull();
    expect(body.id).toBe(id);
  });

  test('findAll should return all categories', async() => {
    const categories = CategoryBuilder.buildCategories();
    await Category.bulkCreate(categories.map((c) => ({ id: c.id!, name: c.name })));

    const response = await request(app).get('/api/categories');
    const body = response.body as Array<CategoryDTO>

    expect(response.statusCode).toBe(200);
    expect(body).not.toBeNull();
    expect(body.length).toBe(categories.length);
  });

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

    const response = await request(app).post('/api/categories')
      .set(AUTHORIZATION, `${BEARER} ${token}`)
      .send({});
    const body = response.body as ErrorResponse;

    expect(response.statusCode).toBe(403);
    expect(body).not.toBeNull();
    expect(body.message.length).toBeGreaterThan(0);
    expect(await Category.count()).toBe(0);
  });

  test('save should return unprocessable when name is null and a worker or admin is authenticated', async() => {
    const token = await getWorkerToken();
    const categoryInputDTO = CategoryInputDTOBuilder.aCategoryInputDTO().withANullName().build();

    const response = await request(app).post('/api/categories')
      .set(AUTHORIZATION, `${BEARER} ${token}`)
      .send(categoryInputDTO);
    const body = response.body as ValidationErrorResponse;

    expect(response.statusCode).toBe(422);
    expect(body.errors.length).toBeGreaterThan(0);
    expect(body.errors.some((e) => e.field === 'name')).toBeTruthy();
    expect(await Category.count()).toBe(0);
  });

  test('save should return unprocessable when name is blank and a worker or admin is authenticated', async() => {
    const token = await getAdminToken();
    const categoryInputDTO = CategoryInputDTOBuilder.aCategoryInputDTO().withABlankName().build();

    const response = await request(app).post('/api/categories')
      .set(AUTHORIZATION, `${BEARER} ${token}`)
      .send(categoryInputDTO);
    const body = response.body as ValidationErrorResponse;

    expect(response.statusCode).toBe(422);
    expect(body.errors.length).toBeGreaterThan(0);
    expect(body.errors.some((e) => e.field === 'name')).toBeTruthy();
    expect(await Category.count()).toBe(0);
  });

  test('save should return unprocessable when name is too short and a worker or admin is authenticated', async() => {
    const token = await getWorkerToken();
    const categoryInputDTO = CategoryInputDTOBuilder.aCategoryInputDTO().withAShortName().build();

    const response = await request(app).post('/api/categories')
      .set(AUTHORIZATION, `${BEARER} ${token}`)
      .send(categoryInputDTO);
    const body = response.body as ValidationErrorResponse;

    expect(response.statusCode).toBe(422);
    expect(body.errors.length).toBeGreaterThan(0);
    expect(body.errors.some((e) => e.field === 'name')).toBeTruthy();
    expect(await Category.count()).toBe(0);
  });

  test('save should return unprocessable when the name is already register and a worker or admin is authenticated', async() => {
    const token = await getWorkerToken();
    const categoryInputDTO = CategoryInputDTOBuilder.aCategoryInputDTO().withARegisterName().build();
    await Category.create({ name: categoryInputDTO.name! });

    const response = await request(app).post('/api/categories')
      .set(AUTHORIZATION, `${BEARER} ${token}`)
      .send(categoryInputDTO);
    const body = response.body as ValidationErrorResponse;

    expect(response.statusCode).toBe(422);
    expect(body.errors.length).toBeGreaterThan(0);
    expect(body.errors.some((e) => e.field === 'name' && e.message === 'Category is already register')).toBeTruthy();
    expect(await Category.count()).toBe(1);
  });

  test('save should save category into database when data is valid and a worker is authenticated', async() => {
    const token = await getWorkerToken();
    const categoryInputDTO = CategoryInputDTOBuilder.aCategoryInputDTO().build();

    const response = await request(app).post('/api/categories')
      .set(AUTHORIZATION, `${BEARER} ${token}`)
      .send(categoryInputDTO);
    const body = response.body as CategoryDTO;

    expect(response.statusCode).toBe(201);
    expect(await Category.count()).toBe(1);
    expect(body).not.toBeNull();
    expect(body.id).not.toBeNull();
  });

  test('save should save category into database when data is valid and an admin is authenticated', async() => {
    const token = await getAdminToken();
    const categoryInputDTO = CategoryInputDTOBuilder.aCategoryInputDTO().build();

    const response = await request(app).post('/api/categories')
      .set(AUTHORIZATION, `${BEARER} ${token}`)
      .send(categoryInputDTO);
    const body = response.body as CategoryDTO;

    expect(response.statusCode).toBe(201);
    expect(await Category.count()).toBe(1);
    expect(body).not.toBeNull();
    expect(body.id).not.toBeNull();
  });

  test('update should return unauthorized when user is not authenticated', async() => {
    const response = await request(app).put('/api/categories/1')
      .send({});
    const body = response.body as ErrorResponse;

    expect(response.statusCode).toBe(401);
    expect(body).not.toBeNull();
    expect(body.message.length).toBeGreaterThan(0);
  });

  test('update should forbidden when a normal user is authenticated', async() => {
    const token = await getUserToken();

    const response = await request(app).put('/api/categories/1')
      .set(AUTHORIZATION, `${BEARER} ${token}`)
      .send({});
    const body = response.body as ErrorResponse;

    expect(response.statusCode).toBe(403);
    expect(body).not.toBeNull();
    expect(body.message.length).toBeGreaterThan(0);
  });

  test('update should return bad request when id is not a number and a worker or admin is authenticated', async() => {
    const token = await getAdminToken();

    const response = await request(app).put('/api/categories/b')
      .set(AUTHORIZATION, `${BEARER} ${token}`)
      .send({});
    const body = response.body as ErrorResponse;

    expect(response.statusCode).toBe(400);
    expect(body).not.toBeNull();
    expect(body.message.length).toBeGreaterThan(0);
  })

  test('update should return unprocessable when name is null and a worker or admin is authenticated', async() => {
    const token = await getWorkerToken();
    const categoryInputDTO = CategoryInputDTOBuilder.aCategoryInputDTO().withANullName().build();

    const response = await request(app).put('/api/categories/1')
      .set(AUTHORIZATION, `${BEARER} ${token}`)
      .send(categoryInputDTO);
    const body = response.body as ValidationErrorResponse;

    expect(response.statusCode).toBe(422);
    expect(body.errors.length).toBeGreaterThan(0);
    expect(body.errors.some((e) => e.field === 'name')).toBeTruthy();
  });

  test('update should return unprocessable when name is blank and a worker or admin is authenticated', async() => {
    const token = await getAdminToken();
    const categoryInputDTO = CategoryInputDTOBuilder.aCategoryInputDTO().withABlankName().build();

    const response = await request(app).put('/api/categories/1')
      .set(AUTHORIZATION, `${BEARER} ${token}`)
      .send(categoryInputDTO);
    const body = response.body as ValidationErrorResponse;

    expect(response.statusCode).toBe(422);
    expect(body.errors.length).toBeGreaterThan(0);
    expect(body.errors.some((e) => e.field === 'name')).toBeTruthy();
  });

  test('update should return unprocessable when name is too short and a worker or admin is authenticated', async() => {
    const token = await getWorkerToken();
    const categoryInputDTO = CategoryInputDTOBuilder.aCategoryInputDTO().withAShortName().build();

    const response = await request(app).put('/api/categories/1')
      .set(AUTHORIZATION, `${BEARER} ${token}`)
      .send(categoryInputDTO);
    const body = response.body as ValidationErrorResponse;

    expect(response.statusCode).toBe(422);
    expect(body.errors.length).toBeGreaterThan(0);
    expect(body.errors.some((e) => e.field === 'name')).toBeTruthy();
  });

  test('update should return unprocessable when name is already register and a worker or admin is authenticated', async() => {
    const token = await getAdminToken();
    const category1 = CategoryInputDTOBuilder.aCategoryInputDTO().withARegisterName().build();
    const registerName = category1.name!;
    const category2 = CategoryInputDTOBuilder.aCategoryInputDTO().build();
    await Category.create({ id: 1, name: registerName });
    await Category.create({ id: 2, name: category2.name! });
    const categoryInputDTO: CategoryInputDTO = {
      name: registerName
    }

    const response = await request(app).put('/api/categories/2')
      .set(AUTHORIZATION, `${BEARER} ${token}`)
      .send(categoryInputDTO);
    const body = response.body as ValidationErrorResponse;

    expect(response.statusCode).toBe(422);
    expect(body.errors.length).toBeGreaterThan(0);
    expect(body.errors.some((e) => e.field === 'name')).toBeTruthy();
  });

  test('update should update database when all data is valid and a worker is authenticated', async() => {
    const token = await getWorkerToken();
    const entity: CategoryEntity = CategoryBuilder.aCategory().build();
    const id = entity.id!;
    await Category.create({ id, name: entity.name });
    const categoryInputDTO = CategoryInputDTOBuilder.aCategoryInputDTO().build();

    const response = await request(app).put(`/api/categories/${id}`)
      .set(AUTHORIZATION, `${BEARER} ${token}`)
      .send(categoryInputDTO);
    const body = response.body as CategoryDTO;

    expect(response.statusCode).toBe(200);
    expect(await Category.count()).toBe(1);
    expect(await Category.findOne({
      where: { name: categoryInputDTO.name! }
     })).not.toBeNull();
    expect(body).not.toBeNull();
    expect(body.id).toBe(id);
  });

  test('update should update database when all data is valid and an admin is authenticated', async() => {
    const token = await getAdminToken();
    const entity: CategoryEntity = CategoryBuilder.aCategory().build();
    const id = entity.id!;
    await Category.create({ id, name: entity.name });
    const categoryInputDTO = CategoryInputDTOBuilder.aCategoryInputDTO().build();

    const response = await request(app).put(`/api/categories/${id}`)
      .set(AUTHORIZATION, `${BEARER} ${token}`)
      .send(categoryInputDTO);
    const body = response.body as CategoryDTO;

    expect(response.statusCode).toBe(200);
    expect(await Category.count()).toBe(1);
    expect(await Category.findOne({
      where: { name: categoryInputDTO.name! }
     })).not.toBeNull();
    expect(body).not.toBeNull();
    expect(body.id).toBe(id);
  });

  test('update should not return unprocessable when update to the same name and a worker or admin is authenticated', async() => {
    const token = await getWorkerToken();
    const categoryInputDTO = CategoryInputDTOBuilder.aCategoryInputDTO().build();
    const id = 1;
    await Category.create({ id, name: categoryInputDTO.name! });

    const response = await request(app).put(`/api/categories/${id}`)
      .set(AUTHORIZATION, `${BEARER} ${token}`)
      .send(categoryInputDTO);
    const body = response.body as CategoryDTO;

    expect(response.statusCode).toBe(200);
    expect(await Category.count()).toBe(1);
    expect(await Category.findOne({
      where: { name: categoryInputDTO.name! }
     })).not.toBeNull();
    expect(body).not.toBeNull();
    expect(body.id).toBe(id);
  });

  test('delete should return unauthorized when user is not authenticated', async() => {
    const response = await request(app).delete('/api/categories/1');
    const body = response.body as ErrorResponse;

    expect(response.statusCode).toBe(401);
    expect(body).not.toBeNull();
    expect(body.message.length).toBeGreaterThan(0);
  });

  test('delete should return forbidden when a normal user is authenticated', async() => {
    const token = await getUserToken();

    const response = await request(app).delete('/api/categories/1')
        .set(AUTHORIZATION, `${BEARER} ${token}`);
    const body = response.body as ErrorResponse;

    expect(response.statusCode).toBe(403);
    expect(body).not.toBeNull();
    expect(body.message.length).toBeGreaterThan(0);
  });

  test('delete should return forbidden when a worker is authenticated', async() => {
    const token = await getWorkerToken();

    const response = await request(app).delete('/api/categories/1')
        .set(AUTHORIZATION, `${BEARER} ${token}`);
    const body = response.body as ErrorResponse;

    expect(response.statusCode).toBe(403);
    expect(body).not.toBeNull();
    expect(body.message.length).toBeGreaterThan(0);
  });

  test('delete should return bad request when id is not a number and an admin is authenticated', async() => {
    const token = await getAdminToken();

    const response = await request(app).delete('/api/categories/d')
      .set(AUTHORIZATION, `${BEARER} ${token}`);
    const body = response.body as ErrorResponse;

    expect(response.statusCode).toBe(400);
    expect(body).not.toBeNull();
    expect(body.message.length).toBeGreaterThan(0);
  });

  test('delete should return not found when id does not exist and an admin is authenticated', async() => {
    const token = await getAdminToken();

    const response = await request(app).delete('/api/categories/1')
      .set(AUTHORIZATION, `${BEARER} ${token}`);
    const body = response.body as ErrorResponse;

    expect(response.statusCode).toBe(404);
    expect(body).not.toBeNull();
    expect(body.message.length).toBeGreaterThan(0);
  });

  test('delete should remove from database when id exists', async() => {
    const existingId = 2;
    await Category.bulkCreate([
      { id: 1, name: 'cat 01' },
      { id: existingId, name: 'cat 02' }
    ]);
    const token = await getAdminToken();

    const response = await request(app).delete(`/api/categories/${existingId}`)
      .set(AUTHORIZATION, `${BEARER} ${token}`);

    expect(response.statusCode).toBe(204);
    expect(await Category.count()).toBe(1);
    expect(await Category.findByPk(existingId)).toBeNull();
  });
});
