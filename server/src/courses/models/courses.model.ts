import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { CustomCourse, Lesson } from "./";

interface CourseCreationAttributes {
    title: string,
    description: string,
    imagePath: string
}

@Table({tableName: 'courses'})
export class Course extends Model<Course, CourseCreationAttributes> {
    @ApiProperty({example: 1, description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'Python start', description: 'Название курса'})
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    title: string;

    @ApiProperty({example: 'Курс по языку программирования Python', description: 'Описание курса'})
    @Column({ type: DataType.STRING, allowNull: false })
    description: string;

    @ApiProperty({example: 'pythonStartLogo.png', description: 'Путь к изображению курса'})
    @Column({ type: DataType.STRING, allowNull: false})
    imagePath: string;

    @ApiProperty({example: [{ id: 1, courseId: 1, title: 'Основы Python' }], description: "Уроки курса"})
    @HasMany(() => Lesson)
    lessons: Lesson[];

    @HasMany(() => CustomCourse, 'courseId')
    customCourses: CustomCourse[];
}