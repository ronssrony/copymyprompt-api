import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { User } from '../user/entities/user.entity';
import { Like } from '../likes/entities/like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, Like])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
