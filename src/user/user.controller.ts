import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from '../guards/auth.guard';
import { UserId } from '../decoretors/userId.decorator';
import configuration from '../config/configuration';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('search')
  findByQuery(
    @Query('username') username?: string,
    @Query('email') email?: string,
  ) {
    if (username) {
      return this.userService.findByUsername(username);
    }
    if (email) {
      return this.userService.findByEmail(email);
    }
    return this.userService.findAll();
  }
  @UseGuards(AuthGuard)
  @Get()
  findOne(@UserId() userId: number) {
    return this.userService.findOne(userId);
  }

  @UseGuards(AuthGuard)
  @Put()
  update(@UserId() userId: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(userId, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete()
  remove(@UserId() userId: number) {
    return this.userService.remove(userId);
  }

  // POST /users/follow/:userId - Follow a user (protected)
  @UseGuards(AuthGuard)
  @Post('follow/:userId')
  followUser(
    @UserId() currentUserId: string,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.userService.followUser(parseInt(currentUserId), userId);
  }

  // DELETE /users/unfollow/:userId - Unfollow a user (protected)
  @UseGuards(AuthGuard)
  @Delete('unfollow/:userId')
  unfollowUser(
    @UserId() currentUserId: string,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.userService.unfollowUser(parseInt(currentUserId), userId);
  }

  // GET /users/following - Get users the current user is following (protected)
  @UseGuards(AuthGuard)
  @Get('following')
  getFollowing(@UserId() userId: string) {
    console.log('following user id', userId);
    return this.userService.getFollowing(parseInt(userId));
  }

  // GET /users/followers - Get current user's followers (protected)
  @UseGuards(AuthGuard)
  @Get('followers')
  getFollowers(@UserId() userId: string) {
    return this.userService.getFollowers(parseInt(userId));
  }

  // GET /users/check-following/:userId - Check if following a user (protected)
  @UseGuards(AuthGuard)
  @Get('check-following/:userId')
  checkFollowing(
    @UserId() currentUserId: string,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.userService.checkFollowing(parseInt(currentUserId), userId);
  }

  // GET /users/profile/:userId - Get user profile
  @Get('profile/:userId')
  getProfile(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('currentUserId') currentUserId?: string,
  ) {
    const currentUserIdNum = currentUserId
      ? parseInt(currentUserId)
      : undefined;
    return this.userService.getProfile(userId, currentUserIdNum);
  }

  // PATCH /users/profile - Update current user's profile (protected)
  // Added: 2025-10-21
  @UseGuards(AuthGuard)
  @Put('profile')
  updateProfile(
    @UserId() userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(parseInt(userId), updateProfileDto);
  }

  // GET /users/top-creators - Get top creators
  // Added: 2025-10-21
  @Get('top-creators')
  getTopCreators(@Query('sortBy') sortBy?: 'posts' | 'followers' | 'copies') {
    return this.userService.getTopCreators(sortBy || 'posts');
  }

  // GET /users/creators-with-posts - Get all creators with their posts
  // Added: 2025-10-26
  @Get('creators-with-posts')
  getCreatorsWithPosts() {
    return this.userService.getCreatorsWithPosts();
  }

  // GET /users/:userId/posts - Get user profile with all their posts
  // Added: 2025-10-21
  @Get(':userId/posts')
  async getProfileWithPosts(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() request: Request,
  ) {
    // Try to extract userId from JWT token if present (optional authentication)
    let currentUserId: number | undefined;

    const token = this.extractTokenFromHeader(request);
    if (token) {
      try {
        const payload: { userId: string } = await this.jwtService.verifyAsync(
          token,
          { secret: configuration().jwt.secret },
        );
        currentUserId = parseInt(payload.userId);
      } catch {
        // Token invalid or expired, continue without currentUserId
        currentUserId = undefined;
      }
    }

    return this.userService.getProfileWithPosts(userId, currentUserId);
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
