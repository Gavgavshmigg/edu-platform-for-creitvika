import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class DeleteRoleDto {

    @ApiProperty({example: 'MANAGER', description: 'Уникальное значение роли'})
    @IsString({message: "Поле должно быть строковым"})
    @IsNotEmpty({message: "Поле не должно быть пустым"})
    readonly value: string;

}