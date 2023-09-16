import CategoryEntity from "../entities/CategoryEntity";
import ICategoryRepository from "../interfaces/ICategoryRepository";
import Category from "../models/Category";

class CategoryRepository implements ICategoryRepository {

  async findById(id: number): Promise<CategoryEntity | null> {
    const category = await Category.findByPk(id);
    if(!category) return null;
    return ({
      ...category.dataValues
    });
  }

  async findByName(name: string): Promise<CategoryEntity | null> {
    const category = await Category.findOne({
      where: {
        name: name
      }
    });
    if(!category) return null;
    return ({
      ...category.dataValues
    });
  }

  async findAll(): Promise<CategoryEntity[]> {
    const categories = await Category.findAll();
    return categories.map((c) => ({ ...c.dataValues }));
  }

  async save(category: CategoryEntity): Promise<CategoryEntity> {
    const saved = await Category.create({ name: category.name });
    return ({ ...saved.dataValues });
  }

  async update(category: CategoryEntity): Promise<CategoryEntity> {
    await Category.update({
      name: category.name
    }, {
      where: {
        id: category.id!
      }
    })
    return ({ ...category })
  }

  async delete(category: CategoryEntity): Promise<void> {
    await Category.destroy({
      where: {
        id: category.id!
      }
    });
  }

}

export default CategoryRepository;
