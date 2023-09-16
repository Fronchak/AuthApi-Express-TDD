import CategoryDTO from "../dtos/category/CategoryDTO";
import CategoryInputDTO from "../dtos/category/CategoryInputDTO";
import CategoryEntity from "../entities/CategoryEntity";
import EntityNotFoundError from "../errors/EntityNotFoundError";
import ICategoryMapper from "../interfaces/ICategoryMapper";
import ICategoryRepository from "../interfaces/ICategoryRepository";
import ICategoryService from "../interfaces/ICategoryService";

class CategoryService implements ICategoryService {

  private readonly categoryRepository: ICategoryRepository;
  private readonly categoryMapper: ICategoryMapper;

  constructor(categoryRepository: ICategoryRepository, categoryMapper: ICategoryMapper) {
    this.categoryRepository = categoryRepository;
    this.categoryMapper = categoryMapper;
  }

  findById = async(id: number): Promise<CategoryDTO> => {
    const category = await this.categoryRepository.findById(id);
    if(!category) {
      throw new EntityNotFoundError('Category not found');
    }
    return this.categoryMapper.mapToCategoryDTO(category);
  }

  findAll = async(): Promise<Array<CategoryDTO>> => {
    const categories = await this.categoryRepository.findAll();
    return this.categoryMapper.mapToCategoryDTOs(categories);
  }

  save = async(categoryInputDTO: CategoryInputDTO): Promise<CategoryDTO> => {
    const categoryEntity: CategoryEntity = { id: null, name: categoryInputDTO.name! }
    const saved = await this.categoryRepository.save(categoryEntity);
    return this.categoryMapper.mapToCategoryDTO(saved);
  }

  update = async(categoryInputDTO: CategoryInputDTO, id: number): Promise<CategoryDTO> => {
    const exists = await this.categoryRepository.exists(id);
    if(!exists) {
      throw new EntityNotFoundError('Category not found');
    }
    const categoryEntity: CategoryEntity = {
      id, name: categoryInputDTO.name!
    };
    const updated = await this.categoryRepository.update(categoryEntity);
    return this.categoryMapper.mapToCategoryDTO(updated);
  }

  deleteById = async(id: number): Promise<void> => {
    const exists = await this.categoryRepository.exists(id);
    if(!exists) {
      throw new EntityNotFoundError('Category not found');
    }

    await this.categoryRepository.delete({ id, name: '' });
  }
}

export default CategoryService;
