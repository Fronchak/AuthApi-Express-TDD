import CategoryEntity from "../../entities/CategoryEntity";

class CategoryBuilder {

  public static readonly id = 1;
  public static readonly primaryName = 'category 01';

  public static readonly secondaryId = 2;
  public static readonly secondaryName = 'category 02';

  public static readonly nonExistingId = 3;

  private category: CategoryEntity;

  private constructor() {
    this.category = {
      id: CategoryBuilder.id,
      name: CategoryBuilder.primaryName
    }
  }

  static aCategory = (): CategoryBuilder => {
    return new CategoryBuilder();
  }

  withSecondaryValues = (): CategoryBuilder => {
    this.category = {
      id: CategoryBuilder.secondaryId,
      name: CategoryBuilder.secondaryName
    }
    return this;
  }

  build = (): CategoryEntity => {
    return this.category;
  }

  static buildCategories = (): Array<CategoryEntity> => {
    return [
      CategoryBuilder.aCategory().build(),
      CategoryBuilder.aCategory().withSecondaryValues().build()
    ];
  }
}

export default CategoryBuilder;
