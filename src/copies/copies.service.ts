import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateCopyDto } from './dto/create-copy.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Copies } from './entities/copy.entity';
import { Post } from '../posts/entities/post.entity';

@Injectable()
export class CopiesService {
  constructor(
    @InjectRepository(Copies)
    private copyRepository: Repository<Copies>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(createCopyDto: CreateCopyDto) {
    // Check if post exists
    const post = await this.postRepository.findOne({
      where: { id: createCopyDto.postId },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Check if user already copied this post
    const existingCopy = await this.copyRepository.findOne({
      where: {
        post: { id: createCopyDto.postId },
        user: { id: createCopyDto.userId },
      },
    });

    if (existingCopy) {
      throw new ConflictException('You have already copied this post');
    }

    // Create copy
    const copy = this.copyRepository.create({
      post: { id: createCopyDto.postId },
      user: { id: createCopyDto.userId },
    });
    const savedCopy = await this.copyRepository.save(copy);

    // Increment copies counter on post
    await this.postRepository.increment(
      { id: createCopyDto.postId },
      'copiesCount',
      1,
    );

    return {
      data: savedCopy,
      message: 'Post copied successfully',
    };
  }

  async findAll() {
    const copies = await this.copyRepository.find({
      relations: ['post', 'user'],
      order: { createdAt: 'DESC' },
    });
    return { data: copies };
  }

  async findByPost(postId: number) {
    const copies = await this.copyRepository.find({
      where: { post: { id: postId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
    return { data: copies };
  }

  async findByUser(userId: number) {
    const copies = await this.copyRepository.find({
      where: { user: { id: userId } },
      relations: ['post', 'post.user', 'post.category'],
      order: { createdAt: 'DESC' },
    });
    return { data: copies };
  }

  async checkUserCopy(postId: number, userId: number) {
    const copy = await this.copyRepository.findOne({
      where: {
        post: { id: postId },
        user: { id: userId },
      },
    });
    return { data: { isCopied: !!copy, copy } };
  }

  async remove(postId: number, userId: number) {
    const copy = await this.copyRepository.findOne({
      where: {
        post: { id: postId },
        user: { id: userId },
      },
    });

    if (!copy) {
      throw new NotFoundException('Copy not found');
    }

    await this.copyRepository.remove(copy);

    // Decrement copies counter on post
    await this.postRepository.decrement({ id: postId }, 'copiesCount', 1);

    return {
      message: 'Copy removed successfully',
    };
  }
}
