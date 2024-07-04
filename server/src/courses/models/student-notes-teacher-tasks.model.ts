import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { TeacherTask } from ".";
import { User } from "src/users/models";

interface StudentNotesTeacherTaskCreationAttributes {
    note: string,
    teacherTaskId: number;
    studentId: number;
}

@Table({tableName: 'student_notes_teacher_tasks'})
export class StudentNotesTeacherTask extends Model<StudentNotesTeacherTask, StudentNotesTeacherTaskCreationAttributes> {
    
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ForeignKey(() => TeacherTask)
    @Column({ type: DataType.INTEGER, allowNull: false})
    teacherTaskId: number

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false})
    studentId: number

    @Column({ type: DataType.STRING, allowNull: false, defaultValue: ""})
    note: string
}