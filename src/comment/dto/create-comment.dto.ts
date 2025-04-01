import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class CreateCommentDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(500)
    comment: string;

    @IsNotEmpty()
    @IsString()
    userid: string;

    @IsNotEmpty()
    @IsNumber()
    blogid: number;
}
    