import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { CustomTask } from ".";
import { User } from "src/users/models";

interface StudentNoteCreationAttributes {
    note: string;
    customTaskId: number;
    studentId: number;
}

@Table({tableName: 'student_notes'})
export class StudentNote extends Model<StudentNote, StudentNoteCreationAttributes> {
    
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ForeignKey(() => CustomTask)
    @Column({ type: DataType.INTEGER, allowNull: false})
    customTaskId: number

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false})
    studentId: number

    @Column({ type: DataType.STRING, allowNull: false, defaultValue: ""})
    note: string
}