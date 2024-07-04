import { ApiProperty } from '@nestjs/swagger';
import { BelongsToMany, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Role } from 'src/roles/roles.model';
import { UserRoles } from 'src/roles/user-roles.model';
import { User } from '.';

@Table({ tableName: 'user_teachers', createdAt: false, updatedAt:false })
export class UserTeachers extends Model<UserTeachers> {

  @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
  @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
  id: number;

  @ApiProperty({example: '1', description: 'Уникальный идентификатор пользователя'})
  @ForeignKey(() => User)
  @Column({type: DataType.INTEGER, allowNull: false })
  userId: number;

  @ApiProperty({example: '1', description: 'Уникальный идентификатор учителя'})
  @ForeignKey(() => User)
  @Column({type: DataType.INTEGER, allowNull: false })
  teacherId: number;
}
