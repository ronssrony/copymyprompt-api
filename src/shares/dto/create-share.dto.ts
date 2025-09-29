import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateShareDto {
  @IsInt()
  @IsNotEmpty()
  postId: number;

  @IsInt()
  @IsNotEmpty()
  userId: number;
}
