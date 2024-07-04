import { ApiProperty } from "@nestjs/swagger";

export class FileUploadDto {
    @ApiProperty({type: 'string', format: 'binary', description: 'Документ с заявкой на регистрацию'})
    file: any;
}