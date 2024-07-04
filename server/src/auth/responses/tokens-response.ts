import { ApiProperty } from "@nestjs/swagger";

export class TokensResponse {

    @ApiProperty({description: 'Токен доступа'})
    accessToken: string;

    @ApiProperty({description: 'Токен обновления'})
    refreshToken: string;
}