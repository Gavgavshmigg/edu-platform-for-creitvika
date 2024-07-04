import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString, ValidateIf } from "class-validator";

export class CreateRoleDto {

    @ApiProperty({example: 'ADMIN', description: 'Уникальное значение роли'})
    @IsString({message: "Поле должно быть строковым"})
    @IsNotEmpty({message: "Поле не должно быть пустым"})
    readonly value: string;

    @ApiProperty({example: 'Администратор', description: 'Название роли'})
    @IsString({message: "Поле должно быть строковым"})
    @IsNotEmpty({message: "Поле не должно быть пустым"})
    readonly name: string;

    @ApiProperty({example: 'true', description: 'Возможность удаления роли'})
    @IsBoolean({message: "Поле должно быть логическим"})
    readonly isNessessory: boolean;
}