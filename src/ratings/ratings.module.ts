import { Module } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { Rating } from './entities/rating.entity';
import { Post } from '../posts/entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Rating, Post])],
  controllers: [RatingsController],
  providers: [RatingsService],
})
export class RatingsModule {}
