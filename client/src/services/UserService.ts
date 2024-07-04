import { AxiosResponse } from "axios";
import $api from "../http";
import { AuthResponse } from "../models/response/AuthResponse";
import { IUser } from "../models/IUser";
import { AttachLessonDto, ICourse, ITask, ITeacherTask, ParagraphTaskBody, SlidesTaskBody } from "../types";
import { CourseResponse } from "../models/response/CourseResponse";
import { CourseContentResponse } from "../models/response/CourseContentResponse";
import { TeacherStudentsResponse } from "../models/response/TeacherStudentsResponse";
import { MaterialResponse } from "../models/response/MaterialResponse";
import { NotesResponse, NotesResponseItem } from "../models/response/NotesResponse";

export default class UserService {
    static fetchUsers(): Promise<AxiosResponse<IUser[]>> {
        return $api.get<IUser[]>('/users');
    }

    static getProfile(): Promise<AxiosResponse<IUser>> {
        return $api.get<IUser>('/users/profile');
    }

    static getProfileById(userId: number): Promise<AxiosResponse<IUser>> {
        return $api.get<IUser>(`/users/${userId}`);
    }

    static getCourses(userId: number): Promise<AxiosResponse<CourseResponse[]>> {
        return $api.get<CourseResponse[]>(`/users/${userId}/courses`);
    }

    static getTeacherCourses(userId: number): Promise<AxiosResponse<CourseResponse[]>> {
        return $api.get<CourseResponse[]>(`/users/teacher/${userId}/courses`);
    }

    static getTeacherCalendar(userId: number) {
        return $api.get<any>(`/users/teacher/${userId}/calendar`);
    }

    static getCourseContent(courseId: number): Promise<AxiosResponse<CourseContentResponse[]>> {
        return $api.get<CourseContentResponse[]>(`/courses/${courseId}/lessons`);
    }

    static getCourseById(courseId: number): Promise<AxiosResponse<CourseResponse>> {
        return $api.get<CourseResponse>(`/courses/${courseId}`);
    }

    static getAllCourses(): Promise<AxiosResponse<ICourse[]>> {
        return $api.get<ICourse[]>(`/courses`);
    }

    static checkAnswers(customTasks: any[], answers: { [key: string]: any }, customLessonId: number) {
        return $api.post<{result: boolean}>(`/courses/lessons/answer`, {customTasks, answers, customLessonId});
    }

    static getAnswers(lessonId: number, studentId: number) {
        return $api.get<any>(`/courses/lessons/${lessonId}/answer?studentId=${studentId}`);
    }

    static getTeacherStudents(teacherId: number) {
        return $api.get<TeacherStudentsResponse[]>(`/users/${teacherId}/students`);
    }

    static getChatMessages(sessionId: string) {
        return $api.get<any[]>(`/courses/messages/${sessionId}`);
    }

    static sendMessage(message: string, sessionId: string) {
        return $api.post<any>(`/courses/messages`, {message, sessionId});
    }

    static getMaterials(courseId: number) {
        return $api.get<MaterialResponse>(`/courses/materials/${courseId}`);
    }

    static attachLesson(dto: AttachLessonDto) {
        return $api.post<any>(`/courses/lessons`, dto);
    }

    static writeNote(note: string, customTaskId: number, isTeacherTask: boolean = false) {
        return $api.post<any>(`/courses/notes`, {customTaskId, note, isTeacherTask});
    }

    static getNotes() {
        return $api.get<NotesResponse>(`/courses/notes`);
    }

    static getNote(customTaskId: number, isTeacherTask: boolean = false) {
        return $api.get<{note: string}>(`/courses/notes/${customTaskId}?isTeacherTask=${isTeacherTask}`);
    }

    static deleteNote(noteId: number, isTeacherTask: boolean = false) {
        return $api.delete<any>(`/courses/notes`, {data: {noteId, isTeacherTask}});
    }

    static getTeacherTasks(teacherId: number) {
        return $api.get<ITask[]>(`/users/teacher/${teacherId}/tasks`);
    }

    static createTeacherTask(teacherId: number, data: FormData) {
        return $api.post<ITask>(`/users/teacher/${teacherId}/tasks`, data, {headers: {"Content-Type": "multipart/form-data"}});
    }

    static updateProfile(data: FormData) {
        return $api.put<IUser>('/users/profile', data, {headers: {"Content-Type": "multipart/form-data"}})
    }

    static addContact(contact: string, contactType: string, userId: number) {
        return $api.post<any>(`/users/contact`, {contact, contactType, userId});
    }

    static attachCourse(studentId: number, teacherId: number, courseId: number) {
        return $api.post<any>(`/courses`, {studentId, teacherId, courseId});
    }
}
