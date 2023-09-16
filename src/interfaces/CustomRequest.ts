import { Request } from "express";
import UserEntity from "../entities/UserEntity";

interface CustomRequest extends Request {
    id: number,
    user: UserEntity
}

export default CustomRequest;
