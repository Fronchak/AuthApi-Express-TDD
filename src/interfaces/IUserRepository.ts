import UserEntity from "../entities/UserEntity";

interface IUserRepository {

  findById(id: number): Promise<UserEntity | null>;

  findByEmail(email: string): Promise<UserEntity | null>;

  save(user: UserEntity): Promise<UserEntity>;

  update(user: UserEntity): Promise<UserEntity>

  delete(user: UserEntity): Promise<void>;
}

export default IUserRepository;
