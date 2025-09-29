import {
  IsInt,
  Min,
  Max,
  IsOptional,
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class CreateRatingDto {
  @IsInt()
  @Min(1)
  @Max(5)
  value: number;

  @IsOptional()
  @IsString()
  body?: string;

  @IsInt()
  @IsNotEmpty()
  postId: number;

  @IsInt()
  @IsNotEmpty()
  userId: number;
}
