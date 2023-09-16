import CategoryBuilder from "../../builders/Category/CategoryBuilder";
import CategoryDTOBuilder from "../../builders/Category/CategoryDTOBuilder";
import CategoryInputDTO from "../../dtos/category/CategoryInputDTO";
import CategoryEntity from "../../entities/CategoryEntity";
import EntityNotFoundError from "../../errors/EntityNotFoundError";
import ICategoryMapper from "../../interfaces/ICategoryMapper";
import ICategoryRepository from "../../interfaces/ICategoryRepository";
import CategoryService from "../CategoryService";

describe('CategoryService', () => {

  const existingId = CategoryBuilder.id;
  const nonExistingId = CategoryBuilder.nonExistingId;
  let category: CategoryEntity;
  let categories: Array<CategoryEntity>;

  let categoryRepository: jest.Mocked<ICategoryRepository>;
  let categoryMapper: jest.Mocked<ICategoryMapper>;
  let categoryService: CategoryService;

  beforeEach(() => {
    category = CategoryBuilder.aCategory().build();
    categories = CategoryBuilder.buildCategories();
    categoryRepository = {
      findById: jest.fn(async (id) => {
        if(id === existingId) return category;
        return null;
      }),
      findByName: jest.fn(),
      exists: jest.fn(async(id) => id === existingId),
      findAll: jest.fn(async() => categories),
      save: jest.fn(async(_) => category),
      update: jest.fn(async(_) => category),
      delete: jest.fn()
    }
    categoryMapper = {
      mapToCategoryDTO: jest.fn((_) => CategoryDTOBuilder.aCategory().build()),
      mapToCategoryDTOs: jest.fn((_) => CategoryDTOBuilder.buildCategoryDTOs())
    }
    categoryService = new CategoryService(categoryRepository, categoryMapper);
  });

  test('findById should throws EntityNotFoundError when id does not exist', async() => {
    expect.assertions(2);
    try {
      await categoryService.findById(nonExistingId);
    }
    catch(e) {
      expect(e).toBeInstanceOf(EntityNotFoundError);
    }
    expect(categoryRepository.findById).toHaveBeenCalledWith(nonExistingId)
  });

  test('findById should return CategoryDTO when id exists', async() => {
    const result = await categoryService.findById(existingId);

    expect(result.id).toBe(CategoryDTOBuilder.id);
    expect(result.name).toBe(CategoryDTOBuilder.primaryName);
    expect(categoryRepository.findById).toHaveBeenCalledWith(existingId);
    expect(categoryMapper.mapToCategoryDTO).toHaveBeenCalledWith(category);
  });

  test('findAll should return all CategoryDTOs', async () => {
    const result = await categoryService.findAll();

    expect(result.length).toBe(categories.length);
    expect(categoryRepository.findAll).toHaveBeenCalledTimes(1);
    expect(categoryMapper.mapToCategoryDTOs).toBeCalledWith(categories);
  });

  test('save should add category to database', async() => {
    const categoryInputDTO: CategoryInputDTO = {
      name: 'category'
    };

    const result = await categoryService.save(categoryInputDTO);

    expect(result.id).toBe(CategoryDTOBuilder.id);
    expect(result.name).toBe(CategoryDTOBuilder.primaryName);
    expect(categoryRepository.save).toHaveBeenCalledTimes(1);
    expect(categoryMapper.mapToCategoryDTO).toHaveBeenCalledWith(category);
  });

  test('update should throws EntityNotFoundError when id does not exist', async() => {
    const categoryInputDTO: CategoryInputDTO = {
      name: 'category'
    };
    expect.assertions(3);
    try {
      await categoryService.update(categoryInputDTO, nonExistingId);
    }
    catch(e) {
      expect(e).toBeInstanceOf(EntityNotFoundError);
    }
    expect(categoryRepository.exists).toHaveBeenCalledWith(nonExistingId);
    expect(categoryRepository.update).not.toHaveBeenCalled();
  });

  test('update should update database when id exists', async() => {
    const categoryInputDTO: CategoryInputDTO = {
      name: 'category'
    };

    const result = await categoryService.update(categoryInputDTO, existingId);

    expect(result.id).toBe(CategoryDTOBuilder.id);
    expect(result.name).toBe(CategoryDTOBuilder.primaryName);
    expect(categoryRepository.update).toHaveBeenCalledTimes(1);
    expect(categoryMapper.mapToCategoryDTO).toHaveBeenCalledWith(category);
  });

  test('deleteById should throws EntityNotFoundError when id does not exist', async() => {
    expect.assertions(2);
    try {
      await categoryService.deleteById(nonExistingId);
    }
    catch(e) {
      expect(e).toBeInstanceOf(EntityNotFoundError);
    }
    expect(categoryRepository.delete).not.toHaveBeenCalled();
  });

  test('deleteById should remove from database when id exists', async() => {
    await categoryService.deleteById(existingId);

    expect(categoryRepository.delete).toHaveBeenCalledTimes(1);
  });
});
