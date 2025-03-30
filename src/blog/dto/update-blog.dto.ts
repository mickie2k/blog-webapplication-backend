import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogDto } from './create-blog.dto';
import { IsNumber } from 'class-validator';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {
    

}
