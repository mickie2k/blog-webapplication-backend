export class CreateBlogDto {
    username: string;
    header: string;
    content: string;
}

export class UpdateBlogDto {
    id: string;
    header: string;
    content: string;
}