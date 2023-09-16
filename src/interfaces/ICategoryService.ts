import CategoryDTO from "../dtos/category/CategoryDTO";
import CategoryInputDTO from "../dtos/category/CategoryInputDTO";

interface ICategoryService {

  findById(id: number): Promise<CategoryDTO>;

  findAll(): Promise<Array<CategoryDTO>>;

  save(categoryInputDTO: CategoryInputDTO): Promise<CategoryDTO>;

  update(categoryInputDTO: CategoryInputDTO, id: number): Promise<CategoryDTO>;

  deleteById(id: number): Promise<void>;
}

export default ICategoryService;
