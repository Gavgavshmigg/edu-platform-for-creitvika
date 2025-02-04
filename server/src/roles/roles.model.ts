import { ApiProperty } from '@nestjs/swagger';
import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript';
import { User } from 'src/users/models/users.model';
import { UserRoles } from './user-roles.model';

interface RoleCreationAttributes {
  value: string;
  name: string;
  isNessessory: boolean;
}

@Table({ tableName: 'roles' })
export class Role extends Model<Role, RoleCreationAttributes> {

  @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
  @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
  id: number;

  @ApiProperty({example: 'ADMIN', description: 'Уникальное значение роли'})
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  value: string;

  @ApiProperty({example: 'Администратор', description: 'Название роли'})
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ApiProperty({example: 'true', description: 'Возможность удаления роли'})
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false})
  isNessessory: boolean;

  @BelongsToMany(() => User, () => UserRoles)
  users: User[];
}
