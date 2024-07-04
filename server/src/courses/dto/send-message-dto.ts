import { IsNotEmpty, IsString } from "class-validator";

export class SendMessageDto {

    @IsNotEmpty({message: "Поле не должно быть пустым"})
    @IsString({message: "Поле должно быть строковым"})
    readonly message: string;

    @IsNotEmpty({message: "Поле не должно быть пустым"})
    @IsString({message: "Поле должно быть строковым"})
    readonly sessionId: string;
}