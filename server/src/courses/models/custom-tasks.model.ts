import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasOne, Model, Table } from "sequelize-typescript";
import { CustomLesson, StudentAnswer, StudentNote, Task } from ".";
import { User } from "src/users/models";

interface CustomTaskCreationAttributes {
    order: number;
}

@Table({tableName: 'custom_tasks'})
export class CustomTask extends Model<CustomTask, CustomTaskCreationAttributes> {
    
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ForeignKey(() => CustomLesson)
    @Column({ type: DataType.INTEGER, allowNull: false})
    customLessonId: number;

    @ForeignKey(() => Task)
    @Column({ type: DataType.INTEGER, allowNull: false})
    taskId: number;

    @Column({ type: DataType.INTEGER, allowNull: false})
    order: number;

    @BelongsTo(() => Task, 'taskId')
    task: Task;

    @BelongsTo(() => CustomLesson, 'customLessonId')
    customLesson: CustomLesson;

    @BelongsToMany(() => User, () => StudentNote, 'customTaskId', 'studentId')
    studentsNotes: User[];

    @BelongsToMany(() => User, () => StudentAnswer, 'customTaskId', 'studentId')
    studentsAnswer: User[];
}