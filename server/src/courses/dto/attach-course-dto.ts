import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class AttachCourseDto {
    @ApiProperty({example: 1, description: 'Уникальный идентификатор учителя'})
    @IsNumber({}, {message: "Поле должно быть числовым"})
    @IsNotEmpty({message: "Поле не должно быть пустым"})
    readonly teacherId: number;

    @ApiProperty({example: 1, description: 'Уникальный идентификатор ученика'})
    @IsNumber({}, {message: "Поле должно быть числовым"})
    @IsNotEmpty({message: "Поле не должно быть пустым"})
    readonly studentId: number;

    @ApiProperty({example: 1, description: 'Уникальный идентификатор курса'})
    @IsNumber({}, {message: "Поле должно быть числовым"})
    @IsNotEmpty({message: "Поле не должно быть пустым"})
    readonly courseId: number;
}