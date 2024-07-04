import { ITask } from "../../types";

export interface MaterialLesson {
    id: number,
    title: string,
    isHometask: boolean,
    tasks: ITask[];
}


export interface MaterialResponse {
    id: number;
    title: string;
    description: string;
    imagePath: string;
    lessons: MaterialLesson[]
}