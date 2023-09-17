import { body } from "express-validator";
import ICategoryRepository from "../../interfaces/ICategoryRepository";

const categoryUpdateValidator = (categoryRepository: ICategoryRepository) => {
  return [
    body('name')
      .custom(async (name, {req}) => {
        if(name !== null && name.length > 0) {
          const id = req.params?.id
          const category = await categoryRepository.findByName(name);
          if(category && category.id != id) {
            throw new Error('Category is already register');
          }
        }
      }),
  ]
}

export default categoryUpdateValidator;
