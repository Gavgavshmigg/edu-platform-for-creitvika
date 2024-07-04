import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { RefreshToken } from './refreshToken.model';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';
import { FilesModule } from 'src/files/files.module';

@Module({
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  controllers: [AuthController],
  imports: [
    UsersModule,
    JwtModule.register({}),
    SequelizeModule.forFeature([RefreshToken])
  ]
})
export class AuthModule {}
