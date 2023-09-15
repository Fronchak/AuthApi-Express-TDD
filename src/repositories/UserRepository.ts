import RoleEntity from "../entities/RoleEntity";
import UserEntity from "../entities/UserEntity";
import IUserRepository from "../interfaces/IUserRepository";
import Role from "../models/Role";
import User from "../models/User";

class UserRepository implements IUserRepository {

  async findById(id: number): Promise<UserEntity | null> {
    const user = await User.findByPk(id, { include: Role });

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

  async save(user: UserEntity): Promise<UserEntity> {
    const saved = await User.create({
      email: user.email,
      password: user.password
    });
    return {
      id: saved.id,
      email: saved.email,
      password: saved.password,
      roles: []
    };
  }

  async update(user: UserEntity): Promise<UserEntity> {
    await User.update({
      email: user.email,
      password: user.password
    }, {
      where: {
        id: user.id!
      }
    });
    return {
      ...user
    }
  }

  async delete(user: UserEntity): Promise<void> {
    await User.destroy({
      where: {
        id: user.id!
      }
    });
  }
}

export default UserRepository;
