import CategoryBuilder from "../../builders/Category/CategoryBuilder";
import CategoryMapper from "../CategoryMapper";

describe('CategoryMapper', () => {

  const categoryMapper = new CategoryMapper();

  test('mapToDTO should map correctly', () => {
    const entity = CategoryBuilder.aCategory().build();

    const result = categoryMapper.mapToCategoryDTO(entity);

    expect(result.id).toBe(CategoryBuilder.id);
    expect(result.name).toBe(CategoryBuilder.primaryName);
  });

  test('mapToDTOs should map correctly', () => {
    const entities = CategoryBuilder.buildCategories();

    const result = categoryMapper.mapToCategoryDTOs(entities);

    expect(result.length).toBe(entities.length);
    expect(result.some((c) => c.id === CategoryBuilder.id && c.name === CategoryBuilder.primaryName)).toBeTruthy();
    expect(result.some((c) => c.id === CategoryBuilder.secondaryId && c.name === CategoryBuilder.secondaryName)).toBeTruthy();
  });
});
