import { makeAutoObservable } from "mobx";
import { ITask } from "../types";

export const IMAGE_FOLDER = "/courses";

export default class SchoolStore {

  studentId: number | null = null;
  socket: WebSocket | null = null;
  sessionId: string | null = null
  username: string = "";
  userId: number | null = null;
  isConnected: boolean = false;
  customLessonId: number | null = null;

  scrollToTaskId: number | null = null;
  scrollToTaskRef: React.RefObject<HTMLLIElement> | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setScrollToTaskId(taskId: number) {
    this.scrollToTaskId = taskId;
  }

  setScrollToTaskRef(ref: React.RefObject<HTMLLIElement>) {
    this.scrollToTaskRef = ref;
  }

  setCustomLessonId(customLessonId: number) {
    this.customLessonId = customLessonId;
  }

  setStudentId(studentId: number) {
    this.studentId = studentId;
  }

  setSocket(socket: WebSocket) {
    this.socket = socket;
}

  setSessionId(sessionId: string) {
      this.sessionId = sessionId;
  }

  setUserId(userId: number) {
      this.userId = userId;
  }

  setUsername(username: string) {
      this.username = username;
  }

  setConnected(isConnected: boolean) {
      this.isConnected = isConnected;
  }
}
