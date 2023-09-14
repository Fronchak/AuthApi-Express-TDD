import UserEntity from "../entities/UserEntity";

interface IUserRepository {

  save(user: UserEntity): Promise<UserEntity>;
}

export default IUserRepository;
