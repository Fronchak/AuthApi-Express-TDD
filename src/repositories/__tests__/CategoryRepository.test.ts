import { Sequelize } from "sequelize-typescript";
import CategoryRepository from "../CategoryRepository";
import path from "path";
import Category from "../../models/Category";
import { Op } from "sequelize";
import CategoryBuilder from "../../builders/Category/CategoryBuilder";

describe('CategoryRepository', () => {

  let categoryRepository: CategoryRepository;
  let sequelize: Sequelize;

  beforeAll(async () => {
    sequelize = new Sequelize({
      logging: false,
      database: 'category_repository_tests',
      dialect: 'sqlite',
      username: 'root',
      password: '',
      storage: ':memory:',
      models: [path.join(__dirname, '..', '..', 'models')]
    });
    await sequelize.sync({ force: true });

    categoryRepository = new CategoryRepository();
  });

  beforeEach(async () => {
    Category.destroy({
      where: {
        id: {
          [Op.gte]: 1
        }
      }
    });

    const categories = CategoryBuilder.buildCategories();
    await Category.bulkCreate(categories.map((c) => ({ id: c.id!, name: c.name })));
  });

  test('findById should return null when id does not exists', async () => {
    const result = await categoryRepository.findById(CategoryBuilder.nonExistingId);

    expect(result).toBeNull();
  });

  test('findById should return entity when id exists', async() => {
    const result = await categoryRepository.findById(CategoryBuilder.secondaryId);

    expect(result).not.toBeNull();
    expect(result?.id).toBe(CategoryBuilder.secondaryId);
    expect(result?.name).toBe(CategoryBuilder.secondaryName);
  });

  test('findByName should return null when name does not exist', async () => {
    const result = await categoryRepository.findByName('non existing name');

    expect(result).toBeNull();
  });

  test('findByName should return entity when email exists', async() => {
    const result = await categoryRepository.findByName(CategoryBuilder.primaryName);

    expect(result).not.toBeNull();
    expect(result?.id).toBe(CategoryBuilder.id);
    expect(result?.name).toBe(CategoryBuilder.primaryName);
  });

  test('findAll should return entities', async () => {
    const result = await categoryRepository.findAll();

    expect(result.length).toBe(2);
    expect(result.some((c) => c.id === CategoryBuilder.id && c.name === CategoryBuilder.primaryName)).toBeTruthy();
    expect(result.some((c) => c.id === CategoryBuilder.secondaryId && c.name === CategoryBuilder.secondaryName)).toBeTruthy();
  });

  test('save should add new entity to database', async() => {
    const name = 'other category';

    const saved = await categoryRepository.save({ name, id: null });

    expect(await Category.count()).toBe(3);
    expect(await Category.findOne({ where: { name: name } })).not.toBeNull();
    expect(saved.id).not.toBeNull();
  });

  test('update should update database', async() => {
    const name = 'other category';

    await categoryRepository.update({ name, id: CategoryBuilder.id });

    expect(await Category.count()).toBe(2);
    expect(await Category.findOne({ where: { name: name } })).not.toBeNull();
  });

  test('delete should remove from database', async () => {
    await categoryRepository.delete({ id: CategoryBuilder.secondaryId, name: '' });

    expect(await Category.count()).toBe(1);
    expect(await Category.findOne({ where: { name: CategoryBuilder.secondaryName } })).toBeNull();
  })
});
