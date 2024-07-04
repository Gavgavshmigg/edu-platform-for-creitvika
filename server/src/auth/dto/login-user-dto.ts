import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, IsNotEmpty } from "class-validator";


export class LoginUserDto {

  @ApiProperty({example: 'login', description: 'Логин'})
  @IsString({message: "Поле должно быть строковым"})
  @IsNotEmpty({message: "Поле не должно быть пустым"})
  readonly login: string;

  @ApiProperty({example: 'qwerty123', description: 'Пароль'})
  @IsString({message: "Поле должно быть строковым"})
  @IsNotEmpty({message: "Поле не должно быть пустым"})
  readonly password: string;
}