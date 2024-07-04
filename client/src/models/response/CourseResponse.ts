import { ICourse, ILesson } from "../../types";
import { IUser } from "../IUser";

export interface CourseResponse {
    id: number,
    course: ICourse,
    customLessons: {
        id: number,
        datetime: string,
        grade: number,
        lesson: ILesson
    }[],
    attachedStudents: IUser[]
}