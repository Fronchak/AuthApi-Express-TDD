import { Request, Response } from "express";
import IAuthService from "../interfaces/IAuthService";

class AuthController {

  private readonly authService: IAuthService;

  constructor(authService: IAuthService) {
    this.authService = authService;
  }

  register = async (req: Request, res: Response) => {
    const tokenDTO = await this.authService.register(req.body);
    return res.status(200).json(tokenDTO);
  }
}

export default AuthController;
