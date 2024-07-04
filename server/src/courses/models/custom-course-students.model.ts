import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "src/users/models";
import { CustomCourse } from ".";


@Table({tableName: 'custom_course_students'})
export class CustomCourseStudent extends Model<CustomCourseStudent> {
    
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false})
    studentId: number

    @ForeignKey(() => CustomCourse)
    @Column({ type: DataType.INTEGER, allowNull: false})
    customCourseId: number
}