import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import { CustomCourse, CustomLessonTeacherTasks, CustomTask, Lesson, TeacherTask } from ".";

interface CustomLessonCreationAttributes {
    lessonId: number;
    order: number;
    datetime: Date;
    grade: string | null;
}

@Table({tableName: 'custom_lessons'})
export class CustomLesson extends Model<CustomLesson, CustomLessonCreationAttributes> {
    
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ForeignKey(() => CustomCourse)
    @Column({ type: DataType.INTEGER, allowNull: false})
    customCourseId: number;

    @ForeignKey(() => Lesson)
    @Column({ type: DataType.INTEGER, allowNull: false})
    lessonId: number;

    @Column({ type: DataType.INTEGER, allowNull: false})
    order: number;

    @Column({ type: DataType.DATE, allowNull: false})
    datetime: Date;

    @Column({ type: DataType.STRING, allowNull: true})
    grade: string | null;
    
    @BelongsTo(() => Lesson, 'lessonId')
    lesson: Lesson;

    @BelongsTo(() => CustomCourse, 'customCourseId')
    customCourse: CustomCourse;

    @HasMany(() => CustomTask)
    customTasks: CustomTask[];

    @BelongsToMany(() => TeacherTask, () => CustomLessonTeacherTasks, 'customLessonId', 'teacherTaskId')
    teacherTasks: TeacherTask[];
}