export interface ITask {
    id: number;
    lessonId: number;
    type: string;
    question: string;
    images?: string[];
    body: ChoiceTaskBody | MultipleChoiceTaskBody |
        FillBlankTaskBody | TextTaskBody |
        MatchingTaskBody |
        BuildSentenceTaskBody | BoardTaskBody |
        SlidesTaskBody | ComboboxTaskBody //|
        //InterpreterTaskBody | AllocationTaskBody;
}

export interface ITeacherTask {
    id: number;
    order: number;
    task: ITask;
}
  
export interface ChoiceTaskBody {
    options: string[];
    correctAnswer: string;
    isImages: boolean;
}

export interface MultipleChoiceTaskBody {
    options: string[];
    correctAnswer: string[];
    isImages: boolean;
}

export interface FillBlankTaskBody {
    sentenses: string[];
    correctAnswer: Array<string[]>;
    isImages: boolean;
}

export interface TextTaskBody {
    correctAnswer: string;
}

export interface MatchingTaskBody {
    firstColumn: string[];
    secondColumn: string[];
    correctAnswer: Array<number[]>;
}

export interface AllocationTaskBody {
    firstColumn: string[];
    secondColumn: string[];
}

export interface BuildSentenceTaskBody {
    words: string[];
    correctAnswer: string[];
    isCode: boolean;
    codeBlockTypes?: string[];
}

export interface BoardTaskBody {
    background?: string;
    correctAnswer?: null
}

export interface SlidesTaskBody {
    images: string[];
    correctAnswer?: null;
}

export interface ComboboxTaskBody {
    words: Array<string[]>;
    correctAnswer: string;
}

export interface ParagraphTaskBody {
    text: string;
}

export interface InterpreterTaskBody {
    initCode: string;
    testValues: any[];
    result: any;
}

export interface ICourse {
    id: number;
    title: string;
    description: string;
    imagePath: string;
    customLessons: {
        datetime: string,
        grade: string
    }
}

export interface ILesson {
    id: number;
    title: string;
    isHometask: boolean;
}

export interface AttachLessonDto {
    customCourseId: number;
    lessonId: number,
    tasks: {taskId: number, order: number, isTeacherTask: boolean}[];
    order: number;
    datetime: string;
}