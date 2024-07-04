import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { RolesAccessGuard } from 'src/common/guards';
import { GetCurrentUserId, Roles } from 'src/common/decorators';
import { AttachCourseDto } from './dto/attach-course-dto';
import { AttachLessonDto, DetachCourseDto, SendMessageDto } from './dto';
import { CreateTeacherTaskDto } from './dto/create-teacher-task-dto';

@Controller('courses')
export class CoursesController {
    constructor(private coursesService: CoursesService) {}

    @Roles("ADMIN")
    @UseGuards(RolesAccessGuard)
    @Get()
    getAllCourses() {
        return this.coursesService.getAllCourses();
    }

    @Roles("ADMIN")
    @UseGuards(RolesAccessGuard)
    @Post()
    attachCourse(@Body() dto: AttachCourseDto) {
        return this.coursesService.attachCourse(dto);
    }

    @Roles("ADMIN")
    @UseGuards(RolesAccessGuard)
    @Delete()
    detachCourse(@Body() dto: DetachCourseDto) {
        return this.coursesService.detachCourse(dto);
    }

    @Roles("ADMIN", "TEACHER")
    @UseGuards(RolesAccessGuard)
    @Post("/lessons")
    attachLesson(@Body() dto: AttachLessonDto) {
        return this.coursesService.attachLesson(dto);
    }

    @Post('/notes')
    writeNote(@GetCurrentUserId() studentId: number, @Body() dto: {customTaskId: number, note: string, isTeacherTask?: boolean}) {
        return this.coursesService.writeNote(studentId, dto.customTaskId, dto.note, dto.isTeacherTask);
    }

    @Get('/notes')
    getStudentNotes(@GetCurrentUserId() studentId: number) {
        return this.coursesService.getStudentNotes(studentId);
    }

    @Get('/notes/:customTaskId')
    getNoteById(@Param('customTaskId') customTaskId: number, @Query('isTeacherTask') isTeacherTask: string = "false") {
        if (isTeacherTask === "false") {
            return this.coursesService.getNoteByCustomTaskId(customTaskId);
        }
        else {
            return this.coursesService.getTeacherTaskNoteByCustomTaskId(customTaskId);
        }
    }

    @Delete('/notes')
    deleteNote(@GetCurrentUserId() studentId: number, @Body() dto: {noteId: number, isTeacherTask: boolean}) {
        return this.coursesService.deleteNote(studentId, dto.noteId, dto.isTeacherTask)
    }

    @Get('/:customCourseId/lessons')
    getCustomCourseLessons(@Param('customCourseId') customCourseId: number) {
        return this.coursesService.getCustomCourseLessons(customCourseId);
    }

    @Get('/:customCourseId')
    getCustomCourse(@Param('customCourseId') customCourseId: number) {
        return this.coursesService.getCustomCourseById(customCourseId);
    }

    @Post('/lessons/answer')
    checkLesson(@GetCurrentUserId() studentId: number, @Body() dto: {customTasks: any[], answers: { [key: string]: any }, customLessonId: number}) {
        return this.coursesService.checkLessonTasks({studentId, customTasks: dto.customTasks, answers: dto.answers, customLessonId: dto.customLessonId});
    }

    @Get('/lessons/:lessonId/answer')
    getAnswers(@Query('studentId') studentId: number, @Param('lessonId') lessonId: number) {
        return this.coursesService.getAnswersByUserId(studentId, lessonId);
    }

    @Post('/messages')
    sendMessage(@GetCurrentUserId() userId: number, @Body() dto: SendMessageDto) {
        return this.coursesService.sendMessage(userId, dto);
    }

    @Get('/messages/:sessionId')
    getChatMessages(@Param('sessionId') sessionId: string) {
        return this.coursesService.getChatMessages(sessionId);
    }

    @Get('/materials/:courseId')
    getMaterial(@Param('courseId') courseId: number) {
        return this.coursesService.getMaterial(courseId);
    }

    @Post('/teacherTasks')
    createTeacherTask(@GetCurrentUserId() teacherId: number, @Body() dto: CreateTeacherTaskDto) {
        return this.coursesService.createTeacherTask(teacherId, dto);
    }

}
