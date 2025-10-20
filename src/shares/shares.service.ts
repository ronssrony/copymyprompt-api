import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateShareDto } from './dto/create-share.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Share } from './entities/share.entity';
import { Post } from '../posts/entities/post.entity';

@Injectable()
export class SharesService {
  constructor(
    @InjectRepository(Share)
    private shareRepository: Repository<Share>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(createShareDto: CreateShareDto) {
    // Check if post exists
    const post = await this.postRepository.findOne({
      where: { id: createShareDto.postId },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Check if user already shared this post
    const existingShare = await this.shareRepository.findOne({
      where: {
        post: { id: createShareDto.postId },
        user: { id: createShareDto.userId },
      },
    });

    if (existingShare) {
      throw new ConflictException('You have already shared this post');
    }

    // Create share
    const share = this.shareRepository.create({
      post: { id: createShareDto.postId },
      user: { id: createShareDto.userId },
    });
    const savedShare = await this.shareRepository.save(share);

    // Increment shares counter on post
    await this.postRepository.increment(
      { id: createShareDto.postId },
      'sharesCount',
      1,
    );

    return {
      data: savedShare,
      message: 'Post shared successfully',
    };
  }

  async findAll() {
    const shares = await this.shareRepository.find({
      relations: ['post', 'user'],
      order: { createdAt: 'DESC' },
    });
    return { data: shares };
  }

  async findByPost(postId: number) {
    const shares = await this.shareRepository.find({
      where: { post: { id: postId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
    return { data: shares };
  }

  async findByUser(userId: number) {
    const shares = await this.shareRepository.find({
      where: { user: { id: userId } },
      relations: ['post', 'post.user', 'post.category'],
      order: { createdAt: 'DESC' },
    });
    return { data: shares };
  }

  async checkUserShare(postId: number, userId: number) {
    const share = await this.shareRepository.findOne({
      where: {
        post: { id: postId },
        user: { id: userId },
      },
    });
    return { data: { isShared: !!share, share } };
  }

  async remove(postId: number, userId: number) {
    const share = await this.shareRepository.findOne({
      where: {
        post: { id: postId },
        user: { id: userId },
      },
    });

    if (!share) {
      throw new NotFoundException('Share not found');
    }

    await this.shareRepository.remove(share);

    // Decrement shares counter on post
    await this.postRepository.decrement({ id: postId }, 'sharesCount', 1);

    return {
      message: 'Share removed successfully',
    };
  }
}
