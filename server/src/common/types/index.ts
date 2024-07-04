import { CustomLesson, Lesson } from "src/courses/models";

export interface ITask {
    id: number;
    lessonId: number;
    type: string;
    question: string;
    images?: string[];
    body: ChoiceTaskBody | MultipleChoiceTaskBody |
        FillBlankTaskBody | TextTaskBody |
        MatchingTaskBody | AllocationTaskBody |
        BuildSentenceTaskBody | BoardTaskBody |
        SlidesTaskBody | ComboboxTaskBody |
        InterpreterTaskBody | ParagraphTaskBody;
    lesson: CustomLesson;
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
}

export interface SlidesTaskBody {
    images: string[];
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