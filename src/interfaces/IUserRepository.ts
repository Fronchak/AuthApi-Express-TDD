import UserEntity from "../entities/UserEntity";

interface IUserRepository {

  save(user: UserEntity): Promise<UserEntity>;

  findByEmail(email: string): Promise<UserEntity | null>;
}

export default IUserRepository;
