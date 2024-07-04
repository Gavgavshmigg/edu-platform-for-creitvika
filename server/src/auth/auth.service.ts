import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/models/';
import { RefreshToken } from './refreshToken.model';
import { InjectModel } from '@nestjs/sequelize';
import { LoginUserDto } from 'src/auth/dto';
import { Tokens } from './types';

@Injectable()
export class AuthService {

    constructor(
        @InjectModel(RefreshToken) private refreshTokenRepository: typeof RefreshToken,
        private usersService: UsersService,
        private jwtService: JwtService) {}

        async login(userDto: LoginUserDto): Promise<Tokens> {
            const user = await this.usersService.getUserByLogin(userDto.login);

            if (!user) {
                throw new HttpException({message: 'Пользователь с таким логином не найден'}, HttpStatus.BAD_REQUEST);
            }

            const isPassEquals = await bcrypt.compare(userDto.password, user.password);
            if (!isPassEquals) {
                throw new HttpException({message: 'Неверный пароль'}, HttpStatus.BAD_REQUEST);
            }

            const tokens = await this.generateTokens(user);
            await this.saveToken(user.id, tokens.refreshToken);

            return {...tokens};
        }
    
        async registration(userDto: CreateUserDto, role: string | null) {

            const user = await this.usersService.createUser(userDto, role);

            const tokens = await this.generateTokens(user);
            await this.saveToken(user.id, tokens.refreshToken);

            return {...tokens}
        }

        async logout(userId: number) {
            const token = await this.removeToken(userId);
            return token;
        }

        async refresh(refreshToken: string) {
            if (!refreshToken) {
                throw new UnauthorizedException('Пользователь не авторизован');
            }

            const userData = this.validateToken(refreshToken);
            const tokenFromDb = await this.findToken(refreshToken);
            if (!userData || !tokenFromDb) {
                throw new UnauthorizedException('Пользователь не авторизован');
            }

            const user = await this.usersService.getUserByLogin(userData.login);
            if (!user) {
                throw new UnauthorizedException('Пользователь не авторизован');
            }

            const tokens = await this.generateTokens(user);
            await this.saveToken(user.id, tokens.refreshToken);

            delete user.password;
            return {...tokens};
        }

        private validateToken(token: string) {
            try {
                const userData = this.jwtService.verify(token, {secret: process.env.JWT_REFRESH_KEY});
                return userData;
            } catch (e) {
                return null;
            }
        }
    
        private async generateTokens(user: User) {
            const payload = { login: user.login, id: user.id, roles: user.roles };

            const [accessToken, refreshToken] = await Promise.all([
                this.jwtService.signAsync(payload,
                    {
                        secret: process.env.JWT_ACCESS_KEY,
                        expiresIn: '30m'
                    }),
                this.jwtService.signAsync(payload,
                    {
                        secret: process.env.JWT_REFRESH_KEY,
                        expiresIn: '30d'
                    })
            ])
    
            return {
                accessToken,
                refreshToken,
            };
        }
    
        private async saveToken(userId: number, refreshToken: string) {
            const tokenData = await this.refreshTokenRepository.findOne({where: {userId}});
            if (tokenData) {
                tokenData.refreshToken = refreshToken;
                return tokenData.save();
            }
            const token = await this.refreshTokenRepository.create({userId, refreshToken});
            return token;
        }
    
        async removeToken(userId: number) {
            const tokenData = await this.refreshTokenRepository.findOne({where: {userId}});
            if (tokenData) {
                await tokenData.destroy();
            }
        }
    
        async findToken(refreshToken: string) {
            const tokenData = await this.refreshTokenRepository.findOne({where: {refreshToken}});
            return tokenData;
        }
}
