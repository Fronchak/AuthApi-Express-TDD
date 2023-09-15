import RoleEntity from "../entities/RoleEntity";
import UserEntity from "../entities/UserEntity";
import IUserRepository from "../interfaces/IUserRepository";
import Role from "../models/Role";
import User from "../models/User";
import { Op } from "sequelize";

class UserRepository implements IUserRepository {

  findByEmail = async (email: string): Promise<UserEntity | null> => {
    const user = await User.findOne({
      where: {
        email: email
      },
      include: Role
    })
    if(user == null) return null;
    const dataValues = user.dataValues;
    const roles: Array<RoleEntity> = dataValues.roles.map((role) => ({
      id: role.id,
      name: role.name
    }));
    return {
      id: dataValues.id,
      email: dataValues.email,
      password: dataValues.password,
      roles
    }
  }

  save(user: UserEntity): Promise<UserEntity> {
    throw new Error();
  }
}

export default UserRepository;
