import { ApiProperty } from '@nestjs/swagger';
import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from 'src/users/models/users.model';


@Table({ tableName: 'tokens' })
export class RefreshToken extends Model<RefreshToken> {

  @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
  @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
  id: number;

  @ApiProperty({example: 'token', description: 'Уникальный токен'})
  @Column({ type: DataType.TEXT, unique: true, allowNull: false })
  refreshToken: string;

  @ForeignKey(() => User)
  @ApiProperty({example: '1', description: 'Уникальный идентификатор пользователя'})
  @Column({ type: DataType.INTEGER, unique: true, allowNull: false })
  userId: number;

  @BelongsTo(() => User)
  user: User
}
