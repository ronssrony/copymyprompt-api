import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { User } from '../user/entities/user.entity';
import { Like } from '../likes/entities/like.entity';
import { Follow } from '../user/entities/follow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, Like, Follow])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
