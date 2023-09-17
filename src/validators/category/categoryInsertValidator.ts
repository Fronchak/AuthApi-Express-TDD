import { body } from "express-validator";
import ICategoryRepository from "../../interfaces/ICategoryRepository";

const categoryInsertValidator = (categoryRepository: ICategoryRepository) => {
  return [
    body('name')
      .custom(async (name) => {
        if(name !== null && name.length > 0) {
          const category = await categoryRepository.findByName(name);
          if(category) {
            throw new Error('Category is already register');
          }
        }
      }),
  ]
}

export default categoryInsertValidator;
