import { Optional } from 'sequelize';
import { Table, Column, Model, DataType, AllowNull, Unique, BelongsToMany } from 'sequelize-typescript';
import User from './User';
import UserRole from './UserRole';

interface RoleAttributes {
  id: number;
  name: string;
}

interface RoleCreationAttributes extends Optional<RoleAttributes, 'id'> {}

@Table
class Role extends Model<RoleAttributes, RoleCreationAttributes> {

  @Unique(true)
  @AllowNull(false)
  @Column({
    type: DataType.STRING(30)
  })
  name!: string;

  @BelongsToMany(() => User, () => UserRole)
  users!: User[]
}

export default Role;
