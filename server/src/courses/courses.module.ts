import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Course, CustomCourse, CustomCourseStudent, CustomLesson, CustomLessonTeacherTasks, CustomTask, Lesson, Message, StudentAnswer, StudentNote, StudentNotesTeacherTask, Task, TeacherTask } from './models';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService],
  imports: [
    SequelizeModule.forFeature([Course, Lesson, Task, CustomCourse, CustomLesson, CustomTask, TeacherTask,
                                CustomLessonTeacherTasks, StudentAnswer, StudentNote, StudentNotesTeacherTask, CustomCourseStudent,
                                Message]),
    UsersModule
  ]
})
export class CoursesModule {}
