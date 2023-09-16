import CategoryDTO from "../dtos/category/CategoryDTO";
import CategoryEntity from "../entities/CategoryEntity";
import ICategoryMapper from "../interfaces/ICategoryMapper";

class CategoryMapper implements ICategoryMapper {

  mapToCategoryDTO = (category: CategoryEntity): CategoryDTO => {
    return {
      id: category.id!, name: category.name
    };
  }

  mapToCategoryDTOs = (categories: Array<CategoryEntity>): Array<CategoryDTO> => {
    return categories.map((c) => this.mapToCategoryDTO(c));
  }
}

export default CategoryMapper;
