import { ITask } from "../../types";

export interface NotesResponseItem {
    customLesson: {
        id: number,
        customCourseId: number
    };
    task: ITask,
    StudentNote: {
        id: number,
        customTaskId: number,
        studentId: number,
        note: string
    };
}

export interface NotesResponse {
    notes: NotesResponseItem[],
    teacherNotes: any[];
}