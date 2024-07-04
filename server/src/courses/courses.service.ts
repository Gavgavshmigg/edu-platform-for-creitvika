import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Course, CustomCourse, CustomCourseStudent, CustomLesson, CustomTask, Lesson, Message, StudentAnswer, StudentNote, StudentNotesTeacherTask, Task, TeacherTask } from './models';
import { UsersService } from 'src/users/users.service';
import { AttachCourseDto, AttachLessonDto, DetachCourseDto, AnswerDto, SendMessageDto } from './dto/';
import { ChoiceTaskBody, ComboboxTaskBody, FillBlankTaskBody, ITask, MatchingTaskBody, MultipleChoiceTaskBody, TextTaskBody } from 'src/common/types';
import { User } from 'src/users/models';
import { CreateTeacherTaskDto } from './dto/create-teacher-task-dto';

@Injectable()
export class CoursesService {
    constructor(
        @InjectModel(Course) private courseRepository: typeof Course,
        @InjectModel(Lesson) private lessonRepository: typeof Lesson,
        @InjectModel(Task) private taskRepository: typeof Task,
        @InjectModel(CustomCourse) private customCourseRepository: typeof CustomCourse,
        @InjectModel(CustomLesson) private customLessonRepository: typeof CustomLesson,
        @InjectModel(CustomTask) private customTaskRepository: typeof CustomTask,
        @InjectModel(StudentAnswer) private studentAnswerRepository: typeof StudentAnswer,
        @InjectModel(StudentNote) private studentNoteRepository: typeof StudentNote,
        @InjectModel(StudentNotesTeacherTask) private studentNotesTeacherTaskRepository: typeof StudentNotesTeacherTask,
        @InjectModel(Message) private messageRepository: typeof Message,
        @InjectModel(TeacherTask) private teacherTaskRepository: typeof TeacherTask,
        private usersService: UsersService
    ) {}

    async getNoteById(noteId: number) {
        return await this.studentNoteRepository.findByPk(noteId);
    }

    async getTeacherTaskNoteById(noteId: number) {
        return await this.studentNotesTeacherTaskRepository.findByPk(noteId);
    }

    async getNoteByCustomTaskId(customTaskId: number) {
        return await this.studentNoteRepository.findOne({where: {customTaskId}});
    }

    async getTeacherTaskNoteByCustomTaskId(teacherTaskId: number) {
        return await this.studentNotesTeacherTaskRepository.findOne({where: {teacherTaskId}});
    }

    async getCourseById(courseId: number) {
        return await this.courseRepository.findByPk(courseId);
    }

    async getAllCourses() {
        return await this.courseRepository.findAll();
    }

    async getMaterial(courseId: number) {
        return await this.courseRepository.findByPk(courseId, {
            include: [
                {
                    model: Lesson,
                    include: [
                        {
                            model: Task
                        }
                    ]
                }
            ]
        })
    }

    async getCustomCourseById(customCourseId: number) {
        return await this.customCourseRepository.findByPk(customCourseId, {
            include: [
                {
                    model: Course
                },
                {
                    association: "attachedStudents",
                    attributes: {
                        exclude: ["password"]
                    }
                }
            ]
        });
    }

    async getLessonById(lessonId: number) {
        return await this.lessonRepository.findByPk(lessonId);
    }

    async getTaskById(taskId: number) {
        return await this.taskRepository.findByPk(taskId);
    }

    async getCustomTaskById(customTaskId: number) {
        return await this.customTaskRepository.findByPk(customTaskId);
    }

    async getTeacherTaskById(teacherTaskId: number) {
        return await this.teacherTaskRepository.findByPk(teacherTaskId);
    }

    async attachCourse(dto: AttachCourseDto) {
        const teacher = await this.usersService.getUserById(dto.teacherId);
        const student = await this.usersService.getUserById(dto.studentId);
        const course = await this.getCourseById(dto.courseId);

        if (teacher && student && course) {
            const customCourse = await this.customCourseRepository.create({
                teacherId: teacher.id,
                courseId: course.id
            });
            
            return await student.$add('attachedCourse', customCourse.id);
        }

        throw new HttpException("Учитель, ученик или курс не найдены", HttpStatus.NOT_FOUND);
        
    }
  
    async detachCourse(dto: DetachCourseDto) {
        const student = await this.usersService.getUserById(dto.studentId);
        const customCourse = await this.getCustomCourseById(dto.customCourseId);

        if (student && customCourse) {
            await student.$remove('attachedCourse', customCourse.id);
            return;
        }

        throw new HttpException("Ученик или курс не найдены", HttpStatus.NOT_FOUND); 
    }
  
    async attachLesson(dto: AttachLessonDto) {
        const customCourse = await this.getCustomCourseById(dto.customCourseId);
        const lesson = await this.getLessonById(dto.lessonId);

        if (!customCourse || !lesson) {
            throw new HttpException("Курс или урок не найден", HttpStatus.NOT_FOUND)
        }

        const customLesson = await customCourse.$create<CustomLesson>("customLesson", {lessonId: lesson.id, order: dto.order, datetime: dto.datetime, grade: null});

        //const customLesson = await this.customLessonRepository.findByPk(1);

        const teacherTasks = dto.tasks.filter((task) => task.isTeacherTask);
        const tasks = dto.tasks.filter((task) => !task.isTeacherTask);

        if (tasks.length > 0) {
            tasks.map(async (task) => await customLesson.$create<CustomTask>("customTask", {taskId: task.taskId, order: task.order}));
        }

        if (teacherTasks.length > 0) {
            teacherTasks.map(async (task) => await customLesson.$create<TeacherTask>("teacherTask", {taskId: task.taskId, order: task.order}));
        }

        return customLesson;
    }
  
    async detachLesson() {
  
    }

    async getCustomCourseLessons(customCourseId: number) {
        const customCourse = await this.getCustomCourseById(customCourseId);
        
        if (customCourse) {
            return await customCourse.$get("customLessons", {
                order: [['order', 'ASC']],
                attributes: ["datetime", "grade"],
                include: [
                    {
                        model: Lesson
                    },
                    {
                        model: CustomTask,
                        attributes: ["order", "id"],
                        order: [['order', 'ASC']],
                        separate: true,
                        include: [
                            {
                                model: Task
                            }
                        ]
                    }
                ]
            });
        }

        throw new HttpException("Курс не найден", HttpStatus.NOT_FOUND);
      }
  
    async attachTasks() {
  
    }
  
    async detachTasks() {
  
    }

    async checkLessonTasks(answers: AnswerDto) {
        let allCorrect = true;
        let cnt = 0;
        let cntFail = 0;
        for (let item of answers.customTasks) {
            let result = (await this.checkTask({task: item.task, studentId: answers.studentId, customTaskId: item.id, answer: answers.answers[item.task.id]}, cnt, cntFail));
            cnt = result.cnt;
            cntFail = result.cntFail;
        }
        if (cntFail > 0) allCorrect = false;
        await this.customLessonRepository.update({grade: `${cnt - cntFail}/${cnt}`}, {where: {id: answers.customLessonId}});
        return allCorrect;
    }

    async checkTask(answer: {task: ITask, studentId: number, customTaskId: number, answer: any}, cnt: number, cntFail: number) {
        const task = await this.getTaskById(answer.task.id);
        const student = await this.usersService.getUserById(answer.studentId);
        if (!answer.customTaskId) console.log(answer);
        const customTask = await this.getCustomTaskById(answer.customTaskId);
        const answerItem = await this.studentAnswerRepository.findOne({where: {studentId: answer.studentId, customTaskId: answer.customTaskId}})

        let allCorrect = true;
        
        if (task && student && customTask) {
            switch(task.type) {
                case 'choice':
                  this.saveAnswer(answer.answer, student.id, customTask.id, answerItem ? answerItem.id : null);
                  if (answer.answer !== (task.body as ChoiceTaskBody).correctAnswer) {
                    allCorrect = false;
                    break;
                  }
                  break;
                case 'multipleChoice':
                  this.saveAnswer(JSON.stringify(answer.answer), student.id, customTask.id, answerItem ? answerItem.id : null);
                  if (!Array.isArray(answer.answer) || !this.arraysEqual(answer.answer, (task.body as MultipleChoiceTaskBody).correctAnswer)) {
                    allCorrect = false;
                    break;
                  }
                  break;
                case 'combobox':
                  this.saveAnswer(answer.answer, student.id, customTask.id, answerItem ? answerItem.id : null);
                  if (answer.answer !== (task.body as ComboboxTaskBody).correctAnswer) {
                    allCorrect = false;
                    break;
                  }
                  break;
                case 'fillBlank':
                  this.saveAnswer(JSON.stringify(answer.answer), student.id, customTask.id, answerItem ? answerItem.id : null);
                  if (!Array.isArray(answer.answer) || !(task.body as FillBlankTaskBody).correctAnswer.every((val, index) => this.arraysEqual(val, answer.answer[index]))) {
                    allCorrect = false;
                    break;
                  }
                  break;
                case 'matching':
                  this.saveAnswer(JSON.stringify(answer.answer), student.id, customTask.id, answerItem ? answerItem.id : null);
                  if (!Array.isArray(answer.answer) || !(task.body as MatchingTaskBody).correctAnswer.every((val, index) => this.arraysEqual(val, answer.answer[index]))) {
                    allCorrect = false;
                    break;
                  }
                    break;
                case 'text':
                  this.saveAnswer(answer.answer, student.id, customTask.id, answerItem ? answerItem.id : null);
                  if (answer.answer !== (task.body as TextTaskBody).correctAnswer) {
                    allCorrect = false;
                    break;
                  }
                  break;
                default:
                    return {cnt, cntFail};
              };
        }

        if (!allCorrect) cntFail++;
        cnt++;

        return {cnt, cntFail};
    }

    async saveAnswer(answer: string, studentId: number, customTaskId: number, answerItemId: number | null = null) {
        if (answerItemId) {
            await this.studentAnswerRepository.update({answer, studentId, customTaskId}, {where: {id: answerItemId}})
        } else {
            await this.studentAnswerRepository.create({answer, studentId, customTaskId})
        }
    }

    async writeNote(studentId:number, customTaskId: number, note: string, isTeacherTask: boolean = false) {
        const student = await this.usersService.getUserById(studentId);
        const task = !isTeacherTask ? await this.getCustomTaskById(customTaskId) : await this.getTeacherTaskById(customTaskId);
        const repository: any = isTeacherTask ? this.studentNotesTeacherTaskRepository : this.studentNoteRepository;
        if (student && task) {
            let data = isTeacherTask ? {teacherTaskId: customTaskId, note, studentId} : {customTaskId, note, studentId};
            let where = isTeacherTask ? {teacherTaskId: customTaskId} : {customTaskId};
            return await repository.upsert(data, {conflictWhere: where});
        }

        throw new HttpException("Пользователь или задание не найдено", HttpStatus.NOT_FOUND);
    }

    async getStudentNotes(studentId: number) {
        const student = await this.usersService.getUserById(studentId);

        if (student) {
            const notes = await student.$get('notes', {
                attributes: [],
                include: [{
                    association: "customLesson",
                    attributes: ["id", "customCourseId"]
                }, {
                    association: "task"
                }],
                order: [["updatedAt", "ASC"]]
            });
            const teacherNotes = await student.$get('teacherTaskNotes', {
                attributes: [],
                include: [{
                    association: "customLessons",
                    attributes: ["id", "customCourseId"],
                    include: [{
                        association: "customCourse",
                        attributes: [],
                        include: [{
                            association: "attachedStudents",
                            attributes: [],
                            where: {
                                id: studentId
                            }
                        }]
                    }]
                }],
                order: [["updatedAt", "ASC"]]
            });

            return {notes, teacherNotes};
        }

        throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND);
    }

    async deleteNote(studentId: number, noteId: number, isTeacherTask: boolean = false) {
        const student = await this.usersService.getUserById(studentId);
        const note = isTeacherTask ? await this.getTeacherTaskNoteById(noteId) : await this.getNoteById(noteId);

        if (student && note) {
            return await note.destroy();
        }

        throw new HttpException("Пользователь или заметка не найдены", HttpStatus.NOT_FOUND);
    }

    async sendMessage(userId: number, dto: SendMessageDto) {
        const user = await this.usersService.getUserById(userId);

        if (user) {
            return await user.$create('message', dto);
        }

        throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND);
    }

    async getAnswersByUserId(userId: number, lessonId: number) {
        const user = await this.usersService.getUserById(userId);
        if (user) {
            return await user.$get('answeredTasks', {
                include: [
                    {
                    model: Task
                    }
                ],
                where: {
                    customLessonId: lessonId
                }
                });
        }

        throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND);
    }

    async getChatMessages(sessionId: string) {
        return await this.messageRepository.findAll({where: {sessionId}, include: [{model: User, attributes:['id', 'name', 'surname', 'patronomic']}]});
    }

    async createTeacherTask(teacherId: number, dto: CreateTeacherTaskDto) {
        const teacher = await this.usersService.getUserById(teacherId);

        if (teacher) {
            return teacher.$create('teacherTask', dto);
        }
        
        throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND);
    }

    private arraysEqual(a: any[], b: any[]) {
        return a.length === b.length && a.every((val, index) => val === b[index]);
      }

}
