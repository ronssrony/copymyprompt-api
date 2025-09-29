import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateCopyDto {
  @IsInt()
  @IsNotEmpty()
  postId: number;

  @IsInt()
  @IsNotEmpty()
  userId: number;
}
