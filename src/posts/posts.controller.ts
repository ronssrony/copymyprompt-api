import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '../guards/auth.guard';
import { UserId } from '../decoretors/userId.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@UserId() userId: string, @Body() createPostDto: CreatePostDto) {
    createPostDto.userId = parseInt(userId);
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll(
    @Query('filter') filter?: 'new' | 'popular' | 'following',
    @Query('userId') userId?: string,
  ) {
    return this.postsService.findAll(filter, userId ? parseInt(userId) : undefined);
  }

  @UseGuards(AuthGuard)
  @Get('my-posts')
  myPost(@UserId() userId: string) {
    return this.postsService.myPost(userId);
  }

  @UseGuards(AuthGuard)
  @Get('liked-posts')
  getLikedPosts(@UserId() userId: string) {
    return this.postsService.getLikedPosts(userId);
  }

  @Get('category/:id')
  getPostsByCategory(@Param('id') id: string) {
    return this.postsService.getPostsByCategory(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }

  @Get('prompts/:type')
  async getPrompts(@Param('type') type: string) {

    return this.postsService.getPromptsByType(type);
  }
}
