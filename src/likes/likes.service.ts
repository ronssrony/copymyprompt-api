import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { Post } from '../posts/entities/post.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(createLikeDto: CreateLikeDto) {
    // Check if post exists
    const post = await this.postRepository.findOne({
      where: { id: createLikeDto.postId },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Check if user already liked this post
    const existingLike = await this.likeRepository.findOne({
      where: {
        post: { id: createLikeDto.postId },
        user: { id: createLikeDto.userId },
      },
    });

    if (existingLike) {
      throw new ConflictException('You have already liked this post');
    }

    // Create like
    const like = this.likeRepository.create({
      post: { id: createLikeDto.postId },
      user: { id: createLikeDto.userId },
    });
    const savedLike = await this.likeRepository.save(like);

    // Increment likes counter on post
    await this.postRepository.increment(
      { id: createLikeDto.postId },
      'likesCount',
      1,
    );

    return {
      data: savedLike,
      message: 'Post liked successfully',
    };
  }

  async findAll() {
    const likes = await this.likeRepository.find({
      relations: ['post', 'user'],
      order: { createdAt: 'DESC' },
    });
    return { data: likes };
  }

  async findByPost(postId: number) {
    const likes = await this.likeRepository.find({
      where: { post: { id: postId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
    return { data: likes };
  }

  async findByUser(userId: number) {
    const likes = await this.likeRepository.find({
      where: { user: { id: userId } },
      relations: ['post', 'post.user', 'post.category'],
      order: { createdAt: 'DESC' },
    });
    return { data: likes };
  }

  async checkUserLike(postId: number, userId: number) {
    const like = await this.likeRepository.findOne({
      where: {
        post: { id: postId },
        user: { id: userId },
      },
    });
    return { data: { isLiked: !!like, like } };
  }

  async remove(postId: number, userId: number) {
    const like = await this.likeRepository.findOne({
      where: {
        post: { id: postId },
        user: { id: userId },
      },
    });

    if (!like) {
      throw new NotFoundException('Like not found');
    }

    await this.likeRepository.remove(like);

    // Decrement likes counter on post
    await this.postRepository.decrement({ id: postId }, 'likesCount', 1);

    return {
      message: 'Like removed successfully',
    };
  }
}
