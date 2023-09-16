import CategoryInputDTO from "../../dtos/category/CategoryInputDTO";

class CategoryInputDTOBuilder {

  static readonly categoryName = 'Category 01';
  static readonly registerCategory = "register category";

  private category: CategoryInputDTO;

  private constructor() {
    this.category = {
      name: CategoryInputDTOBuilder.categoryName
    }
  }

  static aCategoryInputDTO = (): CategoryInputDTOBuilder => {
    return new CategoryInputDTOBuilder();
  }

  withANullName = (): CategoryInputDTOBuilder => {
    this.category.name = null;
    return this;
  }

  withABlankName = (): CategoryInputDTOBuilder => {
    this.category.name = "    ";
    return this;
  }

  withAShortName = (): CategoryInputDTOBuilder => {
    this.category.name = "A";
    return this;
  }

  withARegisterName = (): CategoryInputDTOBuilder => {
    this.category.name = CategoryInputDTOBuilder.registerCategory;
    return this;
  }

  build = (): CategoryInputDTO => {
    return this.category;
  }
}

export default CategoryInputDTOBuilder;
