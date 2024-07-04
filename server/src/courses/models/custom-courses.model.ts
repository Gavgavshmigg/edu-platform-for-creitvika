import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import { User } from "src/users/models";
import { Course, CustomCourseStudent, CustomLesson } from ".";

@Table({tableName: 'custom_courses'})
export class CustomCourse extends Model<CustomCourse> {
    
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false})
    teacherId: number

    @ForeignKey(() => Course)
    @Column({ type: DataType.INTEGER, allowNull: false})
    courseId: number

    @BelongsTo(() => Course, 'courseId')
    course: Course;

    @BelongsTo(() => User, 'teacherId')
    teacher: User;

    @HasMany(() => CustomLesson)
    customLessons: CustomLesson[];

    @BelongsToMany(() => User, () => CustomCourseStudent, 'customCourseId', 'studentId')
    attachedStudents: User[];
}