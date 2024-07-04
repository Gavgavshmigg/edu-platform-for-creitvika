import { ITask } from "src/common/types";

export class AnswerDto {
    customTasks: {id: number, task: ITask}[];
    studentId: number;
    answers: { [key: string]: any };
    customLessonId: number;
}