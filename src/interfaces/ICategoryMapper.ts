import CategoryDTO from "../dtos/category/CategoryDTO";
import CategoryEntity from "../entities/CategoryEntity";

interface ICategoryMapper {

  mapToCategoryDTO(category: CategoryEntity): CategoryDTO;

  mapToCategoryDTOs(categories: Array<CategoryEntity>): Array<CategoryDTO>;
}

export default ICategoryMapper;
