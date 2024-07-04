import { ParagraphTaskBody, SlidesTaskBody } from "src/common/types";

export class CreateTeacherTaskDto {
    readonly type: "paragraph" | "slides";
    readonly question: string;
    readonly body: SlidesTaskBody | ParagraphTaskBody
}