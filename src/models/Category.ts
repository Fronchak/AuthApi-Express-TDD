import { Optional } from 'sequelize';
import { Table, Column, Model, DataType, AllowNull, Unique, BelongsToMany } from 'sequelize-typescript';

interface CategoryAttributes {
  id: number;
  name: string;
}

interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id'> {}

@Table
class Category extends Model<CategoryAttributes, CategoryCreationAttributes> {

  @Unique(true)
  @AllowNull(false)
  @Column({
    type: DataType.STRING(40)
  })
  name!: string;
}

export default Category;
