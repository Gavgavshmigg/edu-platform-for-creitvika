import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/users.model';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AddContactDto, AddRoleDto, AttachTeacherDto, CreateUserDto, UpdateUserDto, CreateTeacherTaskDto } from './dto';
import { RolesService } from 'src/roles/roles.service';
import { Role } from 'src/roles/roles.model';
import { FilesService } from 'src/files/files.service';
import { UserContacts, UserTeachers } from './models';
import * as bcrypt from 'bcryptjs';
import { Course, CustomCourse, CustomLesson, Lesson } from 'src/courses/models';
import { ParagraphTaskBody, SlidesTaskBody } from 'src/common/types';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(UserContacts) private userContactsRepository: typeof UserContacts,
    @InjectModel(UserTeachers) private userTeachers: typeof UserTeachers,
    private rolesService: RolesService,
    private filesService: FilesService
  ) {}

  async createUser(dto: CreateUserDto, roleValue: string | null) {
    const candidate = await this.getUserByLogin(dto.login);
    if (candidate) {
        throw new UnauthorizedException('Пользователь с таким логином существует')
    }
    const hashPassword = await bcrypt.hash(dto.password, 5);
    const user = await this.userRepository.create({...dto, password: hashPassword});
    const role = await this.rolesService.getRoleByValue(roleValue ? roleValue : 'STUDENT');
    await user.$set('roles', [role.id]);
    user.roles = [role]
    delete user.password
    return user;
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll({
      attributes: {
        exclude: ['password']
      },
      include: [{
        model: Role,
        attributes: ['id', 'name', 'value'],
        through: {
          attributes: []
        }
      }],
    });
    return users;
  }

  async getUserByLogin(login: string) {
    const user = await this.userRepository.findOne({
      where: {login},
      attributes: {
        exclude: ['UserRoles']
      },
      include: [{
        model: Role,
        attributes: ['id', 'name', 'value'],
        through: {
          attributes: []
        }
      }],
    });
    return user;
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findByPk(id, {
      attributes: {
        exclude: ['UserRoles', 'password']
      },
      include: [{
        model: Role,
        attributes: ['id', 'name', 'value'],
        through: {
          attributes: []
        }
      },
      {
        model: UserContacts,
        attributes: ['id', 'contact', 'contactType']
      }],
    });
    return user;
  }

  async getUserAttrsById(id: number) {
    const user = await this.userRepository.findByPk(id, {
      attributes: {
        exclude: ['UserRoles', 'password']
      },
      include: [{
        all: true
      }],
    });
    return user;
  }

  async updateUser(dto: UpdateUserDto | CreateUserDto, id: number) {
    const imagePath = dto.file ? await this.filesService.createFile(dto.file) : "";
    const user = await this.userRepository.update({...dto, imagePath}, {where: {id}});

    if (user[0] > 0) {
      return dto;
    }

    throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
  }

  async addRole(dto: AddRoleDto) {
    const user = await this.getUserById(dto.userId);
    const role = await this.rolesService.getRoleByValue(dto.value);
    if (user.roles && user.roles.some(r => r.value === role.value)) {
      throw new HttpException('Пользователь уже имеет данную роль', HttpStatus.BAD_REQUEST);
    }

    if (role && user) {
      await user.$add('role', role.id);
      return dto;
    }

    throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND);
  }

  async removeRole(dto: AddRoleDto) {
    const user = await this.getUserById(dto.userId);
    const role = await this.rolesService.getRoleByValue(dto.value);

    if (role && user) {
      await user.$remove('role', role.id);
      return dto;
    }

    throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND);
  }

  async addContact(dto: AddContactDto) {
    const user = await this.getUserById(dto.userId);
    const contact = await user.$get('contacts', {where: {contact: dto.contact, contactType: dto.contactType}})

    if (contact.length > 0) {
      throw new HttpException('Контактные данные уже существуют', HttpStatus.BAD_REQUEST);
    }
    if (user) {
      await this.userContactsRepository.create(dto);
      return;
      //await user.$create<UserContacts>('contacts', [{contact: dto.contact, contactType: dto.contactType}])
    }

    throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
  }

  async removeContact(dto: AddContactDto) {
    const user = await this.getUserById(dto.userId);
    const contact = await user.$get('contacts', {where: {contact: dto.contact, contactType: dto.contactType}})

    if (contact.length === 0) {
      throw new HttpException('Контактные данные не найдены', HttpStatus.NOT_FOUND);
    }

    if (user) {
      await this.userContactsRepository.destroy({where: {...dto}});
      return;
      //await user.$remove('contacts', contact);
    }

    throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
  }


  async attachTeacher(dto: AttachTeacherDto) {
    const student = await this.getUserById(dto.userId);
    const teacher = await this.getUserById(dto.teacherId);

    if (student.roles && student.roles.some((r) => r.value === "MANAGER" || r.value === "TEACHER")) {
      throw new HttpException('Пользователь не является учеником', HttpStatus.BAD_REQUEST);
    }

    if (teacher.roles && teacher.roles.some((r) => r.value === "MANAGER" || r.value === "STUDENT")) {
      throw new HttpException('Пользователь не является учителем', HttpStatus.BAD_REQUEST);
    }

    if (student && teacher) {
      //console.log(JSON.stringify(dto), JSON.stringify(user.dataValues), JSON.stringify(teacher.dataValues));
      await student.$add('teachers', teacher.id);
      return;
    }

    throw new HttpException('Ученик или учитель не найдены', HttpStatus.NOT_FOUND);
  }

  async detachTeacher(dto: AttachTeacherDto) {
    const student = await this.getUserById(dto.userId);
    const teacher = await this.getUserById(dto.teacherId);

    if (student && teacher) {
      await student.$remove('teachers', teacher.id);
      return;
    }

    throw new HttpException('Ученик или учитель не найдены', HttpStatus.NOT_FOUND);
  }

  async attachStudent(dto: AttachTeacherDto) {
    const student = await this.getUserById(dto.userId);
    const teacher = await this.getUserById(dto.teacherId);

    if (teacher.roles && teacher.roles.some((r) => r.value === "MANAGER" || r.value === "STUDENT")) {
      throw new HttpException('Пользователь не является учителем', HttpStatus.BAD_REQUEST);
    }

    if (student.roles && student.roles.some((r) => r.value === "MANAGER" || r.value === "TEACHER")) {
      throw new HttpException('Пользователь не является учеником', HttpStatus.BAD_REQUEST);
    }

    if (student && teacher) {
      //console.log(JSON.stringify(dto), JSON.stringify(user.dataValues), JSON.stringify(teacher.dataValues));
      await teacher.$add('students', student.id);
      return;
    }

    throw new HttpException('Ученик или учитель не найдены', HttpStatus.NOT_FOUND);
  }

  async detachStudent(dto: AttachTeacherDto) {
    const student = await this.getUserById(dto.userId);
    const teacher = await this.getUserById(dto.teacherId);

    if (student && teacher) {
      await teacher.$remove('students', student.id);
      return;
    }

    throw new HttpException('Ученик или учитель не найдены', HttpStatus.NOT_FOUND);
  }

  async getUserTeachers(userId: number) {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }
  
    const teachers = await user.$get('teachers', {
      attributes: {
        exclude: ['password'],
      },
      include: [
        {
          model: Role,
          attributes: ['id', 'name', 'value'],
          through: {
            attributes: []
          }
        },
        {
          model: UserContacts,
          attributes: ['id', 'contact', 'contactType']
        }
      ],
    });
  
    return teachers;
  }

  async getTeacherUsers(teacherId: number) {
    const teacher = await this.getUserById(teacherId);
    if (!teacher) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }
  
    const students = await teacher.$get('students', {
      attributes: {
        exclude: ['password'],
      },
      include: [
        {
          model: Role,
          attributes: ['id', 'name', 'value'],
          through: {
            attributes: []
          }
        },
        {
          model: UserContacts,
          attributes: ['id', 'contact', 'contactType']
        },
        {
          association: "attachedCourses",
          where: {teacherId},
          through: {
            attributes: []
          },
          include: [
            {
              association: "course"
            },
            {
              association: "customLessons",
              limit: 1,
              order: [['datetime', 'DESC']],
              attributes: ['id', 'datetime', 'grade'],
              through: {
                attributes: []
              },
              include: [{
                association: "lesson"
              }]
            }]
          }
      ],
    });
  
    return students;
  }

  async getStudentCourses(studentId: number) {
    const student = await this.getUserById(studentId);

    if (student) {
      return await student.$get("attachedCourses", {
        include: [
          {
            model: Course
          },
          {
            model: CustomLesson,
            limit: 10,
            order: [['datetime', 'DESC']],
            attributes: ['id', 'datetime', 'grade'],
            through: {
              attributes: []
            },
            include: [{
              model: Lesson
            }]
          }
        ]
      })
    }

    throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
  }

  async getTeacherCourses(teacherId: number) {
    const teacher = await this.getUserById(teacherId);

    if (teacher) {
      return await teacher.$get("customCourses", {
        include: [
          {
            model: Course
          },
          {
            model: CustomLesson,
            limit: 1,
            order: [['datetime', 'DESC']],
            attributes: ['id', 'datetime', 'grade'],
            through: {
              attributes: []
            },
            include: [{
              model: Lesson
            }]
          }
        ]
      })
    }

    throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
  }

  async getTeacherCalendar(teacherId: number) {
    const teacher = await this.getUserById(teacherId);
    
    if (teacher) {
      return await teacher.$get('students', {
        attributes: ["id","surname","name","patronomic"],
        include: [{
          association: "attachedCourses",
          through: {
            attributes: []
          },
          include: [{
            association: "customLessons",
            attributes: ["id", "datetime", "grade"],
            include: [{
              association: "lesson",
              attributes: ["id", "title", "isHometask"]
            }]
          }, {
            association: "course"
          }]
        }]
      })
    }
  }

  async getTeacherTasks(teacherId: number) {
    const teacher = await this.getUserById(teacherId);

    if (teacher) {
      return await teacher.$get('teacherTasks');
    }

    throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
  }

  async createTeacherTask(dto: CreateTeacherTaskDto, teacherId: number, files: Express.Multer.File[]) {
    const teacher = await this.getUserById(teacherId);

    if (teacher && dto.type === "slides" && files.length > 0) {
      let images: string[] = [];
      for (let file of files) {
        images.push(await this.filesService.createFile(file))
      }
      return await teacher.$create('teacherTask', {...dto, body: {images}});
    } else if (teacher && dto.type === "paragraph") {
      const taskBody = dto.body as unknown as string;
      return await teacher.$create('teacherTask', {...dto, body: JSON.parse(taskBody)});
    }

    throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
  }
}
