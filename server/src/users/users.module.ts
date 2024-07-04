import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User, UserContacts, UserTeachers } from './models';
import { Role } from 'src/roles/roles.model';
import { RolesModule } from 'src/roles/roles.module';
import { FilesModule } from 'src/files/files.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User, Role, UserTeachers, UserContacts]),
    RolesModule,
    FilesModule
  ],
  exports: [
    UsersService
  ]
})
export class UsersModule {}
