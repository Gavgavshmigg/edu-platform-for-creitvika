import { Controller, Post, Body, Get, UseGuards, HttpCode, HttpStatus, Delete, UsePipes, Param, Put, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { AddContactDto, AddRoleDto, AttachTeacherDto, CreateTeacherTaskDto, CreateUserDto, UpdateUserDto } from './dto';
import { UsersService } from './users.service';
import { ApiHeaders, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './models/users.model';
import { RolesAccessGuard } from 'src/common/guards';
import { GetCurrentUserId, Roles } from 'src/common/decorators';
import { ValidationPipe } from 'src/common/pipes';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // @ApiOperation({summary: "Создание пользователя"})
  // @ApiResponse({status:201, type: User})
  // @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  // @Roles("ADMIN")
  // @UseGuards(RolesAccessGuard)
  // @Post()
  // @HttpCode(HttpStatus.CREATED)
  // create(@Body() userDto: CreateUserDto) {
  //   return this.usersService.createUser(userDto);
  // }

  @ApiOperation({summary: "Получение списка всех пользователей"})
  @ApiResponse({status:200, type: [User]})
  @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  @Roles("ADMIN")
  @UseGuards(RolesAccessGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  getAll() {
    return this.usersService.getAllUsers();
  }

  @ApiOperation({summary: "Получение профиля авторизованого пользователя"})
  @ApiResponse({status:200, type: User})
  @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  getProfile(@GetCurrentUserId() userId: number) {
    return this.usersService.getUserById(userId);
  }

  @ApiOperation({summary: "Изменение профиля авторизованого пользователя"})
  @ApiResponse({status:200, type: User})
  @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  @UseInterceptors(FileInterceptor('file'))
  @Put('profile')
  @HttpCode(HttpStatus.OK)
  updateProfile(@Body() dto: UpdateUserDto, @UploadedFile() file: Express.Multer.File, @GetCurrentUserId() userId: number) {
    return this.usersService.updateUser({...dto, file}, userId);
  }

  @ApiOperation({summary: "Получение пользователя по id"})
  @ApiResponse({status:200, type: User})
  @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  // @Roles("ADMIN")
  // @UseGuards(RolesAccessGuard)
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  getById(@Param('id') id: number) {
    return this.usersService.getUserById(id);
  }

  @ApiOperation({summary: "Изменение пользователя по id"})
  @ApiResponse({status:200, type: User})
  @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  @Roles("ADMIN")
  @UseGuards(RolesAccessGuard)
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  updateProfileById(@Body() dto: CreateUserDto, @Param('id') id: number) {
    return this.usersService.updateUser(dto, id);
  }

  @ApiOperation({summary: "Выдать роль пользователю"})
  @ApiResponse({status:200, description: "Успешно"})
  @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  @Roles("ADMIN")
  @UseGuards(RolesAccessGuard)
  @Post('/role')
  @HttpCode(HttpStatus.OK)
  addRole(@Body() dto: AddRoleDto) {
    return this.usersService.addRole(dto);
  }

  @ApiOperation({summary: "Убрать роль у пользователя"})
  @ApiResponse({status:200, description: "Успешно"})
  @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  @Roles("ADMIN")
  @UseGuards(RolesAccessGuard)
  @Delete('/role')
  @HttpCode(HttpStatus.OK)
  removeRole(@Body() dto: AddRoleDto) {
    return this.usersService.removeRole(dto);
  }

  @ApiOperation({summary: "Добавить контакт пользователю"})
  @ApiResponse({status:200, description: "Успешно"})
  @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  @Roles("ADMIN", "TEACHER")
  @UseGuards(RolesAccessGuard)
  @Post('/contact')
  @HttpCode(HttpStatus.OK)
  addContact(@Body() dto: AddContactDto) {
    return this.usersService.addContact(dto);
  }

  @ApiOperation({summary: "Убрать контакт у пользователя"})
  @ApiResponse({status:200, description: "Успешно"})
  @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  @Roles("ADMIN", "TEACHER")
  @UseGuards(RolesAccessGuard)
  @Delete('/contact')
  @HttpCode(HttpStatus.OK)
  removeContact(@Body() dto: AddContactDto) {
    return this.usersService.removeContact(dto);
  }

  @ApiOperation({summary: "Прикрепить учителя к ученику"})
  @ApiResponse({status:200, description: "Успешно"})
  @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  @Roles("ADMIN")
  @UseGuards(RolesAccessGuard)
  @Post('/teachers')
  @HttpCode(HttpStatus.OK)
  attachTeacher(@Body() dto: AttachTeacherDto) {
    return this.usersService.attachTeacher(dto);
  }

  @ApiOperation({summary: "Открепить учителя от ученика"})
  @ApiResponse({status:200, description: "Успешно"})
  @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  @Roles("ADMIN")
  @UseGuards(RolesAccessGuard)
  @Delete('/teachers')
  @HttpCode(HttpStatus.OK)
  detachTeacher(@Body() dto: AttachTeacherDto) {
    return this.usersService.detachTeacher(dto);
  }

  @ApiOperation({summary: "Получить учителей ученика"})
  @ApiResponse({status:200, description: "Успешно"})
  @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  @Roles("ADMIN")
  @UseGuards(RolesAccessGuard)
  @Get(':userId/teachers')
  @HttpCode(HttpStatus.OK)
  getUserTeachers(@Param('userId') userId: number) {
    return this.usersService.getUserTeachers(userId);
  }

  @ApiOperation({summary: "Получить учеников учителя"})
  @ApiResponse({status:200, description: "Успешно"})
  @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  @Roles("ADMIN", "TEACHER")
  @UseGuards(RolesAccessGuard)
  @Get(':teacherId/students')
  @HttpCode(HttpStatus.OK)
  getTeacherUsers(@Param('teacherId') teacherId: number) {
    return this.usersService.getTeacherUsers(teacherId);
  }

  @ApiOperation({summary: "Получение всех курсов по id ученика"})
  @ApiResponse({status:200, type: User})
  @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  @Get('/:id/courses')
  @HttpCode(HttpStatus.OK)
  getStudentCourses(@Param('id') id: number) {
    return this.usersService.getStudentCourses(id);
  }

  @ApiOperation({summary: "Получение всех курсов по id учителя"})
  @ApiResponse({status:200, type: User})
  @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  @Get('teacher/:id/courses')
  @HttpCode(HttpStatus.OK)
  getTeacherCourses(@Param('id') id: number) {
    return this.usersService.getTeacherCourses(id);
  }

  @ApiOperation({summary: "Получение расписания учителя"})
  @ApiResponse({status:200, type: User})
  @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  @Get('teacher/:id/calendar')
  @HttpCode(HttpStatus.OK)
  getTeacherCalendar(@Param('id') id: number) {
    return this.usersService.getTeacherCalendar(id);
  }

  @ApiOperation({summary: "Получение заданий учителя"})
  @ApiResponse({status:200, type: User})
  @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  @Get('teacher/:id/tasks')
  @HttpCode(HttpStatus.OK)
  getTeacherTasks(@Param('id') id: number) {
    return this.usersService.getTeacherTasks(id);
  }

  @ApiOperation({summary: "Создание заданий учителя"})
  @ApiResponse({status:200, type: User})
  @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
  @UseInterceptors(FilesInterceptor('files'))
  @Post('teacher/:id/tasks')
  @HttpCode(HttpStatus.OK)
  createTeacherTask(@Body() dto: CreateTeacherTaskDto, @Param('id') id: number, @UploadedFiles() files?: Express.Multer.File[]) {
    return this.usersService.createTeacherTask(dto, id, files);
  }
}
