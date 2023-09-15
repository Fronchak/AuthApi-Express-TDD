import { Optional } from 'sequelize';
import { Table, Column, Model, DataType, AllowNull, Unique, BelongsToMany } from 'sequelize-typescript';
import Role from './Role';
import UserRole from './UserRole';

interface UserAttributes {
  id: number;
  email: string;
  password: string;
  roles: Role[];
}

type keys = keyof UserAttributes;

type optionalKeys = 'id' | 'roles';

interface UserCreationAttributesAux extends Optional<UserAttributes, optionalKeys> {}

//interface UserCreationAttributes extends Optional<UserCreationAttributesAux, 'roles'> {}

@Table
class User extends Model<UserAttributes, UserCreationAttributesAux> {

  @Unique(true)
  @AllowNull(false)
  @Column({
    type: DataType.STRING(100)
  })
  email!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(200)
  })
  password!: string;

  @BelongsToMany(() => Role, () => UserRole)
  roles!: Role[]
}

export default User;
