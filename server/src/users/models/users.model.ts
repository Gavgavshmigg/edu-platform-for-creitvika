import { ApiProperty } from '@nestjs/swagger';
import { BelongsTo, BelongsToMany, Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Role } from 'src/roles/roles.model';
import { UserRoles } from 'src/roles/user-roles.model';
import { UserContacts, UserTeachers } from '.';
import { CustomCourse, CustomCourseStudent, CustomTask, Message, StudentAnswer, StudentNote, StudentNotesTeacherTask, TeacherTask } from 'src/courses/models';

interface UserCreationAttributes {
  login: string;
  password: string;
  name: string;
  surname: string;
  patronomic: string;
  gender: string;
  parentFullname: string | null;
  tips: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttributes> {

  @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
  @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
  id: number;

  @ApiProperty({example: 'Иван', description: 'Имя'})
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ApiProperty({example: 'Иванов', description: 'Фамилия'})
  @Column({ type: DataType.STRING, allowNull: false })
  surname: string;

  @ApiProperty({example: 'Иванович', description: 'Отчество'})
  @Column({ type: DataType.STRING, allowNull: true })
  patronomic: string;

  @ApiProperty({example: 'login', description: 'Логин'})
  @Column({ type: DataType.STRING, allowNull: false })
  login: string;

  //@ApiProperty({example: 'qwerty123', description: 'Пароль'})
  @Column({ type: DataType.STRING, allowNull: false})
  password: string;

  @ApiProperty({example: 'Мужской', description: 'Пол'})
  @Column({ type: DataType.STRING, allowNull: false })
  gender: string;

  @ApiProperty({example: 'Иванова Ольга Владимировна', description: 'Полное имя родителя'})
  @Column({ type: DataType.STRING, allowNull: true })
  parentFullname: string | null;

  @ApiProperty({example: 'Спокойный, вежливый', description: 'Примечание'})
  @Column({ type: DataType.STRING, allowNull: true })
  tips: string;

  @Column({ type: DataType.STRING, allowNull: true })
  imagePath: string;

  @ApiProperty({example: [{id: 1, value: 'ADMIN', name: 'Администратор'}], description: 'Список ролей пользователя'})
  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];

  @BelongsToMany(() => User, () => UserTeachers, 'userId', 'teacherId')
  teachers: User[];

  @BelongsToMany(() => User, () => UserTeachers, 'teacherId', 'userId')
  students: User[];

  @HasMany(() => UserContacts)
  contacts: UserContacts[]
  
  @HasMany(() => TeacherTask, 'teacherId')
  teacherTasks: TeacherTask[];

  @BelongsToMany(() => CustomTask, () => StudentAnswer, 'studentId', 'customTaskId')
  answeredTasks: CustomTask[];

  @BelongsToMany(() => CustomTask, () => StudentNote, 'studentId', 'customTaskId')
  notes: CustomTask[];

  @BelongsToMany(() => TeacherTask, () => StudentNotesTeacherTask, 'studentId', 'teacherTaskId')
  teacherTaskNotes: TeacherTask[];

  @BelongsToMany(() => CustomCourse, () => CustomCourseStudent, 'studentId', 'customCourseId')
  attachedCourses: CustomCourse[];

  @HasMany(() => CustomCourse, 'teacherId')
  customCourses: CustomCourse[];

  @HasMany(() => Message, 'userId')
  messages: Message[];
}
