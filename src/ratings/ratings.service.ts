import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { Post } from '../posts/entities/post.entity';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(createRatingDto: CreateRatingDto) {
    // Check if post exists
    const post = await this.postRepository.findOne({
      where: { id: createRatingDto.postId },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Check if user already rated this post
    const existingRating = await this.ratingRepository.findOne({
      where: {
        post: { id: createRatingDto.postId },
        user: { id: createRatingDto.userId },
      },
    });

    if (existingRating) {
      throw new ConflictException('You have already rated this post');
    }

    // Create rating
    const rating = this.ratingRepository.create({
      post: { id: createRatingDto.postId },
      user: { id: createRatingDto.userId },
      value: createRatingDto.value,
      body: createRatingDto.body,
    });
    const savedRating = await this.ratingRepository.save(rating);

    // Update ratings counter and value on post
    await this.postRepository.increment(
      { id: createRatingDto.postId },
      'ratingsCount',
      1,
    );
    await this.postRepository.increment(
      { id: createRatingDto.postId },
      'ratingsValue',
      createRatingDto.value,
    );

    return {
      data: savedRating,
      message: 'Post rated successfully',
    };
  }

  async findAll() {
    const ratings = await this.ratingRepository.find({
      relations: ['post', 'user'],
      order: { createdAt: 'DESC' },
    });
    return { data: ratings };
  }

  async findByPost(postId: number) {
    const ratings = await this.ratingRepository.find({
      where: { post: { id: postId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
    return { data: ratings };
  }

  async findByUser(userId: number) {
    const ratings = await this.ratingRepository.find({
      where: { user: { id: userId } },
      relations: ['post', 'post.user', 'post.category'],
      order: { createdAt: 'DESC' },
    });
    return { data: ratings };
  }

  async checkUserRating(postId: number, userId: number) {
    const rating = await this.ratingRepository.findOne({
      where: {
        post: { id: postId },
        user: { id: userId },
      },
    });
    return { data: { isRated: !!rating, rating } };
  }

  async update(postId: number, userId: number, updateRatingDto: UpdateRatingDto) {
    const rating = await this.ratingRepository.findOne({
      where: {
        post: { id: postId },
        user: { id: userId },
      },
    });

    if (!rating) {
      throw new NotFoundException('Rating not found');
    }

    const oldValue = rating.value;
    const newValue = updateRatingDto.value ?? oldValue;
    const valueDifference = newValue - oldValue;

    // Update rating
    if (updateRatingDto.value !== undefined) {
      rating.value = updateRatingDto.value;
    }
    if (updateRatingDto.body !== undefined) {
      rating.body = updateRatingDto.body;
    }

    const updatedRating = await this.ratingRepository.save(rating);

    // Update ratings value on post if value changed
    if (valueDifference !== 0) {
      if (valueDifference > 0) {
        await this.postRepository.increment(
          { id: postId },
          'ratingsValue',
          valueDifference,
        );
      } else {
        await this.postRepository.decrement(
          { id: postId },
          'ratingsValue',
          Math.abs(valueDifference),
        );
      }
    }

    return {
      data: updatedRating,
      message: 'Rating updated successfully',
    };
  }

  async remove(postId: number, userId: number) {
    const rating = await this.ratingRepository.findOne({
      where: {
        post: { id: postId },
        user: { id: userId },
      },
    });

    if (!rating) {
      throw new NotFoundException('Rating not found');
    }

    const ratingValue = rating.value;
    await this.ratingRepository.remove(rating);

    // Decrement ratings counter and value on post
    await this.postRepository.decrement({ id: postId }, 'ratingsCount', 1);
    await this.postRepository.decrement(
      { id: postId },
      'ratingsValue',
      ratingValue,
    );

    return {
      message: 'Rating removed successfully',
    };
  }
}
