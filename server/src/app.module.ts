import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/models/users.model';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/roles.model';
import { UserRoles } from './roles/user-roles.model';
import { AuthModule } from './auth/auth.module';
import { RefreshToken } from './auth/refreshToken.model';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './common/guards';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { UserContacts, UserTeachers } from './users/models';
import { CoursesModule } from './courses/courses.module';
import { Course, CustomCourse, CustomCourseStudent, CustomLesson, CustomLessonTeacherTasks, CustomTask, Lesson, Message, StudentAnswer, StudentNote, StudentNotesTeacherTask, Task, TeacherTask } from './courses/models';


@Module({
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard
    }
  ],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'static')
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Role, UserRoles, RefreshToken, UserTeachers, UserContacts, Course, Lesson, Task,
        CustomCourse, CustomLesson, CustomTask, TeacherTask,
        CustomLessonTeacherTasks, StudentAnswer, StudentNote, StudentNotesTeacherTask, CustomCourseStudent,
        Message],
      autoLoadModels: true,
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    FilesModule,
    CoursesModule,
  ],
})
export class AppModule {}
