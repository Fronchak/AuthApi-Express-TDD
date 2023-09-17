import { Request, Response } from "express";
import ICategoryService from "../interfaces/ICategoryService";

class CategoryController {

  private categoryService: ICategoryService;

  constructor(categoryService: ICategoryService) {
    this.categoryService = categoryService;
  }

  findById = async(req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id);
    const categoryDTO = await this.categoryService.findById(id);
    return res.status(200).json(categoryDTO);
  }

  findAll = async(req: Request, res: Response) => {
    const categoryDTOs = await this.categoryService.findAll();
    return res.status(200).json(categoryDTOs);
  }

  save = async(req: Request, res: Response) => {
    const categoryDTO = await this.categoryService.save(req.body);
    return res.status(201).json(categoryDTO);
  }

  update = async(req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id);
    const categoryDTO = await this.categoryService.update(req.body, id);
    return res.status(200).json(categoryDTO);
  }

  deleteById = async(req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id);
    await this.categoryService.deleteById(id);
    return res.status(204).send();
  }
}

export default CategoryController;
