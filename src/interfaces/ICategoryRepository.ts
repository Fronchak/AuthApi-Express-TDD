import CategoryEntity from "../entities/CategoryEntity";

interface ICategoryRepository {

  findById(id: number): Promise<CategoryEntity | null>;

  findByName(name: string): Promise<CategoryEntity | null>;

  exists(id: number): Promise<boolean>;

  findAll(): Promise<CategoryEntity[]>;

  save(category: CategoryEntity): Promise<CategoryEntity>;

  update(category: CategoryEntity): Promise<CategoryEntity>;

  delete(category: CategoryEntity): Promise<void>;
}

export default ICategoryRepository;
