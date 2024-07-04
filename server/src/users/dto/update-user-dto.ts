import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UpdateUserDto {

  // @ApiProperty({example: 'login', description: 'Логин'})
  // @IsString({message: "Поле должно быть строковым"})
  // @IsNotEmpty({message: "Поле не должно быть пустым"})
  // readonly login: string;

  // @IsString({message: "Поле должно быть строковым"})
  // @IsNotEmpty({message: "Поле не должно быть пустым"})
  // @ApiProperty({example: 'qwerty123', description: 'Пароль'})
  // readonly password: string;

  @IsString({message: "Поле должно быть строковым"})
  @IsNotEmpty({message: "Поле не должно быть пустым"})
  readonly name: string;
  
  @IsString({message: "Поле должно быть строковым"})
  @IsNotEmpty({message: "Поле не должно быть пустым"})
  readonly surname: string;

  @IsString({message: "Поле должно быть строковым"})
  @IsNotEmpty({message: "Поле не должно быть пустым"})
  readonly patronomic: string;

  readonly file?: Express.Multer.File

}
