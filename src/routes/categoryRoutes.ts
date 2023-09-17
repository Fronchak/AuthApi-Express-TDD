import { Router } from "express";
import ITokenValidator from "../interfaces/ITokenValidator";
import checkToken from "../middlewares/checkToken";
import checkRoles from "../middlewares/checkRoles";
import checkIdParam from "../middlewares/checkIdParam";
import CategoryController from "../controllers/CategoryController";
import resolver from "./resolver";
import categoryInputValidator from "../validators/category/categoryInputValidator";
import checkValidationErrors from "../middlewares/checkValidationErrors";
import ICategoryRepository from "../interfaces/ICategoryRepository";
import categoryInsertValidator from "../validators/category/categoryInsertValidator";
import categoryUpdateValidator from "../validators/category/categoryUpdateValidator";
import checkWorkerOrAdmin from "../middlewares/checkWorkerOrAdmin";
import checkAdmin from "../middlewares/checkAdmin";


const categoryRoutes = (
  categoryController: CategoryController,
  categoryRepository: ICategoryRepository,
  tokenValidator: ITokenValidator
): Router => {
  const routes = Router();

  routes.get('', resolver(categoryController.findAll));

  routes.get('/:id',
    checkIdParam,
    resolver(categoryController.findById)
  );

  routes.post('',
    checkToken(tokenValidator),
    checkWorkerOrAdmin(),
    categoryInputValidator(),
    categoryInsertValidator(categoryRepository),
    checkValidationErrors,
    resolver(categoryController.save)
  );

  routes.put('/:id',
    checkToken(tokenValidator),
    checkWorkerOrAdmin(),
    checkIdParam,
    categoryInputValidator(),
    categoryUpdateValidator(categoryRepository),
    checkValidationErrors,
    resolver(categoryController.update)
  );

  routes.delete('/:id',
    checkToken(tokenValidator),
    checkAdmin(),
    checkIdParam,
    resolver(categoryController.deleteById)
  );

  return routes;
}

export default categoryRoutes;
