import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class AttachTeacherDto {

    @ApiProperty({example: 1, description: 'Уникальный идентификатор пользователя'})
    @IsNumber({}, {message: "Поле должно быть числовым"})
    @IsNotEmpty({message: "Поле не должно быть пустым"})
    readonly userId: number;

    @ApiProperty({example: 1, description: 'Уникальный идентификатор учителя'})
    @IsNumber({}, {message: "Поле должно быть числовым"})
    @IsNotEmpty({message: "Поле не должно быть пустым"})
    readonly teacherId: number;
}