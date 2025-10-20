import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { AuthGuard } from '../guards/auth.guard';
import { UserId } from '../decoretors/userId.decorator';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  // POST /ratings - Rate a post (protected)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createRatingDto: CreateRatingDto, @UserId() userId: string) {
    createRatingDto.userId = parseInt(userId);
    return this.ratingsService.create(createRatingDto);
  }

  // GET /ratings - Get all ratings (admin)
  @Get()
  findAll() {
    return this.ratingsService.findAll();
  }

  // GET /ratings/post/:postId - Get all ratings for a post
  @Get('post/:postId')
  findByPost(@Param('postId') postId: string) {
    return this.ratingsService.findByPost(+postId);
  }

  // GET /ratings/my-ratings - Get user's ratings (protected)
  @UseGuards(AuthGuard)
  @Get('my-ratings')
  findByUser(@UserId() userId: string) {
    return this.ratingsService.findByUser(parseInt(userId));
  }

  // GET /ratings/check/:postId - Check if user rated a post (protected)
  @UseGuards(AuthGuard)
  @Get('check/:postId')
  checkUserRating(@Param('postId') postId: string, @UserId() userId: string) {
    return this.ratingsService.checkUserRating(+postId, parseInt(userId));
  }

  // PATCH /ratings/:postId - Update a rating (protected)
  @UseGuards(AuthGuard)
  @Patch(':postId')
  update(
    @Param('postId') postId: string,
    @Body() updateRatingDto: UpdateRatingDto,
    @UserId() userId: string,
  ) {
    return this.ratingsService.update(
      +postId,
      parseInt(userId),
      updateRatingDto,
    );
  }

  // DELETE /ratings/:postId - Remove a rating (protected)
  @UseGuards(AuthGuard)
  @Delete(':postId')
  remove(@Param('postId') postId: string, @UserId() userId: string) {
    return this.ratingsService.remove(+postId, parseInt(userId));
  }
}
