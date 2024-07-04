import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "src/users/models";

interface MessageCreationAttributes {
    message: string;
    sessionId: string;
}

@Table({tableName:'messages'})
export class Message extends Model<Message, MessageCreationAttributes> {
    
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: false})
    userId: number;

    @Column({type: DataType.STRING, allowNull: false})
    message: string;

    @Column({type: DataType.STRING, allowNull: false})
    sessionId: string;

    @BelongsTo(() => User)
    user: User;
}