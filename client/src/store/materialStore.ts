import { makeAutoObservable } from "mobx";
import { ITask } from "../types";

export default class MaterialStore {
    lessonId: number | null = null;
    tasks: ITask[] = [];

    constructor () {
        makeAutoObservable(this);
    }

    setLessonId(lessonId: number) {
        this.lessonId = lessonId;
    }

    getIndexOfTask(taskId: number) {
        return this.tasks.map(task => task.id).indexOf(taskId);
    }

    pushTask(task: ITask) {
        this.tasks.push(task); 
    }

    popTask(index: number) {
        this.tasks.splice(index, 1);
    }

    setTasks(tasks: ITask[]) {
        this.tasks = tasks;
    }

    switchTasks(i: number, j: number) {
        [this.tasks[i], this.tasks[j]] = [this.tasks[j], this.tasks[i]];
    }


}