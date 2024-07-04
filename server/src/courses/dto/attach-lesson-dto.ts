import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDate, IsDateString, IsNotEmpty, IsNumber } from "class-validator";

export class AttachLessonDto {

    @ApiProperty({example: 1, description: 'Уникальный идентификатор курса'})
    @IsNumber({}, {message: "Поле должно быть числовым"})
    @IsNotEmpty({message: "Поле не должно быть пустым"})
    readonly customCourseId: number;

    @ApiProperty({example: 1, description: 'Уникальный идентификатор урока'})
    @IsNumber({}, {message: "Поле должно быть числовым"})
    @IsNotEmpty({message: "Поле не должно быть пустым"})
    readonly lessonId: number;

    @ApiProperty({example: [1, 2, 3], description: 'Уникальные идентификаторы заданий'})
    @IsArray({message: "Поле должно быть массивом"})
    @IsNotEmpty({message: "Поле не должно быть пустым"})
    readonly tasks: {taskId: number, order: number, isTeacherTask: boolean}[];

    @ApiProperty({example: 1, description: 'Номер в последовательности'})
    @IsNumber({}, {message: "Поле должно быть числовым"})
    @IsNotEmpty({message: "Поле не должно быть пустым"})
    readonly order: number;

    @ApiProperty({example: Date.now(), description: 'Дата проведения занятия'})
    @IsDateString({}, {message: "Поле должно представлять дату"})
    @IsNotEmpty({message: "Поле не должно быть пустым"})
    readonly datetime: Date;
}