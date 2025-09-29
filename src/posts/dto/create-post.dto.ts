import {
  IsString,
  IsOptional,
  IsNumber,
  IsInt,
  Min,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsNotEmpty()
  prompt?: string;

  @IsString()
  @IsNotEmpty()
  image?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  price?: number;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  model?: string;

  @IsNotEmpty()
  categoryId?: number;

  @IsNotEmpty()
  userId: number;
}
