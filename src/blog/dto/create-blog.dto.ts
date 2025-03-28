import { Escape } from "class-sanitizer";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateBlogDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @Escape()
    title: string;
    
    @IsString()
    @IsNotEmpty()
    @Escape()
    content: string;
}
