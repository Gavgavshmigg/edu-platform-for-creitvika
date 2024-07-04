import { ILesson, ITask } from "../../types";

export interface CourseContentResponse {
    id: number,
    datetime: string,
    lesson: ILesson,
    grade: string,
    customTasks: {
        id: number;
        order: number;
        task: ITask;
    }[]
}