import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { BoardTaskBody, ParagraphTaskBody, SlidesTaskBody } from "src/common/types";
import { CustomLesson } from "./custom-lessons.model";
import { CustomLessonTeacherTasks } from "./custom-lesson-teacher-tasks.model";
import { User } from "src/users/models";
import { StudentNotesTeacherTask } from "./student-notes-teacher-tasks.model";

interface TeacherTaskCreationAttributes {
    type: string,
    question: string,
    body: ParagraphTaskBody | SlidesTaskBody
}

@Table({tableName: 'teacher_tasks'})
export class TeacherTask extends Model<TeacherTask, TeacherTaskCreationAttributes> {
    @ApiProperty({example: 1, description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false})
    teacherId: number

    @ApiProperty({example: 'choice', description: 'Тип задания'})
    @Column({ type: DataType.STRING, allowNull: false })
    type: string;

    @ApiProperty({example: 'Какой язык программирования мы изучаем?', description: 'Вопрос к заданию'})
    @Column({ type: DataType.STRING, allowNull: false })
    question: string;

    @Column({ type: DataType.JSON, allowNull: false })
    body: ParagraphTaskBody | SlidesTaskBody

    @BelongsToMany(() => CustomLesson, () => CustomLessonTeacherTasks, 'teacherTaskId', 'customLessonId')
    customLessons: CustomLesson[];

    @BelongsTo(() => User)
    teacher: User;

    @BelongsToMany(() => User, () => StudentNotesTeacherTask, 'teacherTaskId', 'studentId')
    studentsNotes: User[];
}