import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SharesService } from './shares.service';
import { CreateShareDto } from './dto/create-share.dto';
import { AuthGuard } from '../guards/auth.guard';
import { UserId } from '../decoretors/userId.decorator';

@Controller('shares')
export class SharesController {
  constructor(private readonly sharesService: SharesService) {}

  // POST /shares - Share a post (protected)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createShareDto: CreateShareDto, @UserId() userId: string) {
    createShareDto.userId = parseInt(userId);
    return this.sharesService.create(createShareDto);
  }

  // GET /shares - Get all shares (admin)
  @Get()
  findAll() {
    return this.sharesService.findAll();
  }

  // GET /shares/post/:postId - Get all shares for a post
  @Get('post/:postId')
  findByPost(@Param('postId') postId: string) {
    return this.sharesService.findByPost(+postId);
  }

  // GET /shares/my-shares - Get user's shares (protected)
  @UseGuards(AuthGuard)
  @Get('my-shares')
  findByUser(@UserId() userId: string) {
    return this.sharesService.findByUser(parseInt(userId));
  }

  // GET /shares/check/:postId - Check if user shared a post (protected)
  @UseGuards(AuthGuard)
  @Get('check/:postId')
  checkUserShare(@Param('postId') postId: string, @UserId() userId: string) {
    return this.sharesService.checkUserShare(+postId, parseInt(userId));
  }

  // DELETE /shares/:postId - Remove a share (protected)
  @UseGuards(AuthGuard)
  @Delete(':postId')
  remove(@Param('postId') postId: string, @UserId() userId: string) {
    return this.sharesService.remove(+postId, parseInt(userId));
  }
}
