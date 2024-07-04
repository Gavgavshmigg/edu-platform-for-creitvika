import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UploadedFile, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiHeaders, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/auth/dto';
import { Tokens } from './types';
import { RefreshTokenGuard } from 'src/common/guards';
import { GetCurrentUser, GetCurrentUserId, Public } from 'src/common/decorators';
import { TokensResponse } from './responses';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @ApiOperation({summary: "Авторизация"})
    @ApiResponse({status:200, type: TokensResponse})
    @Public()
    @Post('/login')
    @HttpCode(HttpStatus.OK)
    login(@Body() userDto: LoginUserDto): Promise<Tokens> {
        return this.authService.login(userDto);
    }

    @ApiOperation({summary: "Регистрация"})
    @ApiResponse({status:201, type: TokensResponse})
    @Public()
    @Post('/registration/:role')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({type: CreateUserDto, description: 'Данные пользователя'})
    @HttpCode(HttpStatus.CREATED)
    registration(@Body() userDto: CreateUserDto, @Param('role') role: string | null) {
        return this.authService.registration(userDto, role);
    }

    @ApiOperation({summary: "Выход из аккаунта"})
    @ApiResponse({status:200, description: "Успешно"})
    @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
    @Post('/logout')
    @HttpCode(HttpStatus.OK)
    logout(@GetCurrentUserId() userId: number) {
        return this.authService.logout(userId);
    }

    @ApiOperation({summary: "Обновление токена"})
    @ApiResponse({status:200, type: TokensResponse})
    @ApiHeaders([{name: "Authorization", description: "Требуется токен обновления в заголовке авторизации"}])
    @Public() //Избегаем AccessTokenGuard
    @UseGuards(RefreshTokenGuard)
    @Post('/refresh')
    @HttpCode(HttpStatus.OK)
    refresh(@GetCurrentUser('refreshToken') refreshToken: string ) {
        return this.authService.refresh(refreshToken);
    }

    @ApiOperation({summary: "Проверка авторизации"})
    @ApiResponse({status:200, description: "Успешно"})
    @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
    @Public() //Избегаем AccessTokenGuard
    @UseGuards(RefreshTokenGuard)
    @Get('/check')
    @HttpCode(HttpStatus.OK)
    check(@GetCurrentUser('refreshToken') refreshToken: string) {
        return this.authService.findToken(refreshToken) ? true : false;
    }
}
