import { ApiProperty } from '@nestjs/swagger';
import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Role } from 'src/roles/roles.model';
import { UserRoles } from 'src/roles/user-roles.model';
import { User } from '.';

interface UserContactsCreationAttributes {
    contact: string;
    contactType: string;
}

@Table({ tableName: 'user_contacts', createdAt: false, updatedAt:false })
export class UserContacts extends Model<UserContacts, UserContactsCreationAttributes> {

  @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
  @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
  id: number;

  @ApiProperty({example: '1', description: 'Уникальный идентификатор пользователя'})
  @ForeignKey(() => User)
  @Column({type: DataType.INTEGER, allowNull: false })
  userId: number;

  @ApiProperty({example: '+79876543210', description: 'Контактные данные'})
  @Column({type: DataType.STRING, allowNull: false })
  contact: string;

  @ApiProperty({example: 'tel', description: 'Тип контактов'})
  @Column({type: DataType.STRING, allowNull: false })
  contactType: string;

  @BelongsTo(() => User)
  user: User;
}
