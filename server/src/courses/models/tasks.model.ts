import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { AllocationTaskBody, BoardTaskBody, BuildSentenceTaskBody, ChoiceTaskBody, ComboboxTaskBody, FillBlankTaskBody, InterpreterTaskBody, MatchingTaskBody, MultipleChoiceTaskBody, SlidesTaskBody, TextTaskBody } from "src/common/types";
import { Lesson } from "./";

interface TaskCreationAttributes {
    type: string,
    question: string,
    body: ChoiceTaskBody | MultipleChoiceTaskBody |
        FillBlankTaskBody | TextTaskBody |
        MatchingTaskBody | AllocationTaskBody |
        BuildSentenceTaskBody | BoardTaskBody |
        SlidesTaskBody | ComboboxTaskBody |
        InterpreterTaskBody;
}

@Table({tableName: 'tasks'})
export class Task extends Model<Task, TaskCreationAttributes> {
    @ApiProperty({example: 1, description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'choice', description: 'Тип задания'})
    @Column({ type: DataType.STRING, allowNull: false })
    type: string;

    @ApiProperty({example: 'Какой язык программирования мы изучаем?', description: 'Вопрос к заданию'})
    @Column({ type: DataType.STRING, allowNull: false })
    question: string;

    @Column({ type: DataType.JSON, allowNull: false })
    body: ChoiceTaskBody | MultipleChoiceTaskBody |
        FillBlankTaskBody | TextTaskBody |
        MatchingTaskBody | AllocationTaskBody |
        BuildSentenceTaskBody | BoardTaskBody |
        SlidesTaskBody | ComboboxTaskBody |
        InterpreterTaskBody;

    @ForeignKey(() => Lesson)
    @Column({ type: DataType.INTEGER, allowNull: false})
    lessonId: number;

    @ApiProperty({example: { id: 1, courseId: 1, title: 'Основы Python' }, description: "Урок задания"})
    @BelongsTo(() => Lesson)
    lesson: Lesson;
}