import { IsNotEmpty } from "class-validator";
import { ParagraphTaskBody, SlidesTaskBody } from "src/common/types";

export class CreateTeacherTaskDto {

    @IsNotEmpty()
    readonly type: string;
    @IsNotEmpty()
    readonly question: string;

    readonly body: ParagraphTaskBody | SlidesTaskBody;
}