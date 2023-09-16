import CategoryDTO from "../../dtos/category/CategoryDTO";

class CategoryDTOBuilder {

  public static readonly id = 3;
  public static readonly primaryName = 'category 03';

  public static readonly secondaryId = 4;
  public static readonly secondaryName = 'category 04';

  private category: CategoryDTO;

  private constructor() {
    this.category = {
      id: CategoryDTOBuilder.id,
      name: CategoryDTOBuilder.primaryName
    }
  }

  static aCategory = (): CategoryDTOBuilder => {
    return new CategoryDTOBuilder();
  }

  withSecondaryValues = (): CategoryDTOBuilder => {
    this.category = {
      id: CategoryDTOBuilder.secondaryId,
      name: CategoryDTOBuilder.secondaryName
    }
    return this;
  }

  build = (): CategoryDTO => {
    return this.category;
  }

  static buildCategoryDTOs = (): Array<CategoryDTO> => {
    return [
      CategoryDTOBuilder.aCategory().build(),
      CategoryDTOBuilder.aCategory().withSecondaryValues().build()
    ];
  }
}

export default CategoryDTOBuilder;
