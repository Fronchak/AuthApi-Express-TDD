import { Optional } from 'sequelize';
import { Table, Column, Model, DataType, AllowNull, Unique, ForeignKey } from 'sequelize-typescript';
import User from './User';
import Role from './Role';

interface UserRoleAttributes {
  userId: number;
  roleId: number;
}

@Table
class UserRole extends Model<UserRoleAttributes> {

  @ForeignKey(() => User)
  @Column
  userId!: number;

  @ForeignKey(() => Role)
  @Column
  roleId!: number;
}

export default UserRole
