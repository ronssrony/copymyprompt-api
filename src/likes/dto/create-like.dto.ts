import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateLikeDto {
  @IsInt()
  @IsNotEmpty()
  postId: number;

  @IsInt()
  @IsNotEmpty()
  userId: number;
}
