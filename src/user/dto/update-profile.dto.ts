import { IsString, IsOptional, MaxLength } from 'class-validator';

// DTO for updating user profile (username, bio, image only - no email)
// Added: 2025-10-21
export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  username?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  image?: string;

  @IsOptional()
  @IsString()
  bio?: string;
}
