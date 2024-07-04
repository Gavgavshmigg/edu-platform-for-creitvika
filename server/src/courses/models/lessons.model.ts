import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Course, CustomLesson, Task } from "./";

interface LessonCreationAttributes {
    title: string,
    isHometask: boolean
}

@Table({tableName: 'lessons'})
export class Lesson extends Model<Lesson, LessonCreationAttributes> {
    @ApiProperty({example: 1, description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'Основы Python', description: 'Название урока'})
    @Column({ type: DataType.STRING, allowNull: false })
    title: string;

    @ApiProperty({example: false, description: 'Это домашнее задание?'})
    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false})
    isHometask: boolean

    @ForeignKey(() => Course)
    @Column({ type: DataType.INTEGER, allowNull: false})
    courseId: number;

    @ApiProperty({example: { id: 1, title: 'Python start', description: "Курс по языку программирования Python", imagePath: `pythonStartLogo.png` }, description: "Курс урока"})
    @BelongsTo(() => Course)
    course: Course;

    @HasMany(() => Task)
    tasks: Task[];

    @HasMany(() => CustomLesson, 'lessonId')
    customLessons: CustomLesson[];
}