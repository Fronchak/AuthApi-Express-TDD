import RoleEntity from "./RoleEntity";

type UserEntity = {
  id: number | null,
  email: string,
  password: string,
  roles: Array<RoleEntity>
};

export default UserEntity;
