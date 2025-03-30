
import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import * as _ from 'lodash'
export class CreateBlogDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @Transform(({ value }) => _.escape(value))
    title: string;
    
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => _.escape(value))
    content: string;
}
