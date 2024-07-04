import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEmail, IsNotEmpty, IsString } from "class-validator";
import { FileUploadDto } from "src/files/dto";

export class CreateUserDto {

  @ApiProperty({example: 'login', description: 'Логин'})
  @IsString({message: "Поле должно быть строковым"})
  @IsNotEmpty({message: "Поле не должно быть пустым"})
  readonly login: string;

  @IsString({message: "Поле должно быть строковым"})
  @IsNotEmpty({message: "Поле не должно быть пустым"})
  @ApiProperty({example: 'qwerty123', description: 'Пароль'})
  readonly password: string;

  @IsString({message: "Поле должно быть строковым"})
  @IsNotEmpty({message: "Поле не должно быть пустым"})
  @ApiProperty({example: 'Иван', description: 'Имя'})
  readonly name: string;

  @IsString({message: "Поле должно быть строковым"})
  @IsNotEmpty({message: "Поле не должно быть пустым"})
  @ApiProperty({example: 'Иванов', description: 'Фамилия'})
  readonly surname: string;

  @IsString({message: "Поле должно быть строковым"})
  @ApiProperty({example: 'Иванович', description: 'Отчество'})
  readonly patronomic: string;

  @IsString({message: "Поле должно быть строковым"})
  @IsNotEmpty({message: "Поле не должно быть пустым"})
  @ApiProperty({example: 'Мужской', description: 'Пол'})
  readonly gender: string;

  @IsString({message: "Поле должно быть строковым"})
  @ApiProperty({example: 'Иванова Ольга Владимировна', description: 'Полное имя родителя'})
  readonly parentFullname: string | null;

  @IsString({message: "Поле должно быть строковым"})
  @ApiProperty({example: 'Спокойный, вежливый', description: 'Примечание'})
  readonly tips: string;

  readonly file?: Express.Multer.File
}
