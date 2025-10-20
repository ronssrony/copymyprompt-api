import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { AuthGuard } from '../guards/auth.guard';
import { UserId } from '../decoretors/userId.decorator';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  // POST /likes - Like a post (protected)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createLikeDto: CreateLikeDto, @UserId() userId: string) {
    createLikeDto.userId = parseInt(userId);
    return this.likesService.create(createLikeDto);
  }

  // GET /likes - Get all likes (admin)
  @Get()
  findAll() {
    return this.likesService.findAll();
  }

  // GET /likes/post/:postId - Get all likes for a post
  @Get('post/:postId')
  findByPost(@Param('postId') postId: string) {
    return this.likesService.findByPost(+postId);
  }

  // GET /likes/my-likes - Get user's likes (protected)
  @UseGuards(AuthGuard)
  @Get('my-likes')
  findByUser(@UserId() userId: string) {
    return this.likesService.findByUser(parseInt(userId));
  }

  // GET /likes/check/:postId - Check if user liked a post (protected)
  @UseGuards(AuthGuard)
  @Get('check/:postId')
  checkUserLike(@Param('postId') postId: string, @UserId() userId: string) {
    return this.likesService.checkUserLike(+postId, parseInt(userId));
  }

  // DELETE /likes/:postId - Unlike a post (protected)
  @UseGuards(AuthGuard)
  @Delete(':postId')
  remove(@Param('postId') postId: string, @UserId() userId: string) {
    return this.likesService.remove(+postId, parseInt(userId));
  }
}
