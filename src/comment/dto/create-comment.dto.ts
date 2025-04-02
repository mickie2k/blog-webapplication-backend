import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";
export class CreateCommentDto {    
    
    @IsNotEmpty()
    @IsNumber()
    blogid: number;

    @IsNotEmpty()
    @IsString()
    @MaxLength(500)
    content: string;


}
