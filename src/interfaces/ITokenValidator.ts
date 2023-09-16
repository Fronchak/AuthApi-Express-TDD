import UserEntity from "../entities/UserEntity";

interface ITokenValidator {

  validateToken(token: string | undefined): Promise<UserEntity | null>;
}

export default ITokenValidator;
