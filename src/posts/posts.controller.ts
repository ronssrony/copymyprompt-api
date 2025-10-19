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
  findAll() {
    return this.postsService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('my-posts')
  myPost(@UserId() userId: string) {
    console.log('userId', userId);
    return this.postsService.myPost(userId);
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
    console.log('type', type);
    return this.postsService.getPromptsByType(type);
  }
}
