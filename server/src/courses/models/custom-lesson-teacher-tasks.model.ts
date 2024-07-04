import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { CustomLesson, TeacherTask } from ".";

interface CustomLessonTeacherTasksCreationAttributes {
    order: number
}

@Table({tableName: 'custom_lesson_teacher_tasks'})
export class CustomLessonTeacherTasks extends Model<CustomLessonTeacherTasks, CustomLessonTeacherTasksCreationAttributes> {
    
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ForeignKey(() => TeacherTask)
    @Column({ type: DataType.INTEGER, allowNull: false})
    teacherTaskId: number

    @ForeignKey(() => CustomLesson)
    @Column({ type: DataType.INTEGER, allowNull: false})
    customLessonId: number

    @Column({ type: DataType.INTEGER, allowNull: false})
    order: number
}