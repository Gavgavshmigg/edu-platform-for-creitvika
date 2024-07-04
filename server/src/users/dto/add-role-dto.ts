import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AddRoleDto {
    @ApiProperty({example: 'ADMIN', description: 'Уникальное значение роли'})
    @IsString({message: "Поле должно быть строковым"})
    @IsNotEmpty({message: "Поле не должно быть пустым"})
    readonly value: string;

    @ApiProperty({example: '1', description: 'Уникальный идентификатор пользователя'})
    @IsNumber({}, {message: "Поле должно быть числовым"})
    @IsNotEmpty({message: "Поле не должно быть пустым"})
    readonly userId: number;
}