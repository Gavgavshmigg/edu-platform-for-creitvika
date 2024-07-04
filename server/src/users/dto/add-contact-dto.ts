import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AddContactDto {
    @ApiProperty({example: '+71234567890', description: 'Контакт пользователя'})
    @IsString({message: "Поле должно быть строковым"})
    @IsNotEmpty({message: "Поле не должно быть пустым"})
    readonly contact: string;

    @ApiProperty({example: 'tel', description: 'Тип контакта'})
    @IsString({message: "Поле должно быть строковым"})
    @IsNotEmpty({message: "Поле не должно быть пустым"})
    readonly contactType: string;

    @ApiProperty({example: 1, description: 'Уникальный идентификатор пользователя'})
    @IsNumber({}, {message: "Поле должно быть числовым"})
    @IsNotEmpty({message: "Поле не должно быть пустым"})
    readonly userId: number;
}