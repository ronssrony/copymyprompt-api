import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CopiesService } from './copies.service';
import { CreateCopyDto } from './dto/create-copy.dto';
import { AuthGuard } from '../guards/auth.guard';
import { UserId } from '../decoretors/userId.decorator';

@Controller('copies')
export class CopiesController {
  constructor(private readonly copiesService: CopiesService) {}

  // POST /copies - Copy a post (protected)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createCopyDto: CreateCopyDto, @UserId() userId: string) {
    createCopyDto.userId = parseInt(userId);
    return this.copiesService.create(createCopyDto);
  }

  // GET /copies - Get all copies (admin)
  @Get()
  findAll() {
    return this.copiesService.findAll();
  }

  // GET /copies/post/:postId - Get all copies for a post
  @Get('post/:postId')
  findByPost(@Param('postId') postId: string) {
    return this.copiesService.findByPost(+postId);
  }

  // GET /copies/my-copies - Get user's copies (protected)
  @UseGuards(AuthGuard)
  @Get('my-copies')
  findByUser(@UserId() userId: string) {
    return this.copiesService.findByUser(parseInt(userId));
  }

  // GET /copies/check/:postId - Check if user copied a post (protected)
  @UseGuards(AuthGuard)
  @Get('check/:postId')
  checkUserCopy(@Param('postId') postId: string, @UserId() userId: string) {
    return this.copiesService.checkUserCopy(+postId, parseInt(userId));
  }

  // DELETE /copies/:postId - Remove a copy (protected)
  @UseGuards(AuthGuard)
  @Delete(':postId')
  remove(@Param('postId') postId: string, @UserId() userId: string) {
    return this.copiesService.remove(+postId, parseInt(userId));
  }
}
