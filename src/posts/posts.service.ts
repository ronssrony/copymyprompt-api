import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository, In } from 'typeorm';
import { Post } from './entities/post.entity';
import { Like } from '../likes/entities/like.entity';
import { Follow } from '../user/entities/follow.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(Like) private likeRepository: Repository<Like>,
    @InjectRepository(Follow) private followRepository: Repository<Follow>,
  ) {}

  private readonly selectFields = {
    id: true,
    title: true,
    prompt: true,
    image: true,
    price: true,
    model: true,
    likesCount: true,
    sharesCount: true,
    copiesCount: true,
    ratingsCount: true,
    ratingsValue: true,
    createdAt: true,
    user: {
      id: true,
      username: true,
      image: true,
    },
    category: {
      name: true,
    },
  };

  async create(createPostDto: CreatePostDto) {
    const post = this.postRepository.create(createPostDto);
    const savedPost = await this.postRepository.save(post);

    const createdPost = await this.postRepository.findOne({
      where: { id: savedPost.id },
      relations: ['user', 'category'],
      select: this.selectFields,
    });

    return { data: createdPost };
  }

  async findAll(
    filter?: 'new' | 'popular' | 'following',
    userId?: number,
    categoryId?: number,
  ) {
    let order: any = {};
    let where: any = {};

    // Handle different filters
    if (filter === 'new') {
      // Show newest posts first (this is the default behavior)
      order = { createdAt: 'DESC' };
    } else if (filter === 'popular') {
      // Show posts sorted by highest copies count first
      order = { copiesCount: 'DESC', createdAt: 'DESC' };
    } else if (filter === 'following') {
      // Show posts only from users that the userId is following
      if (!userId) {
        // If no userId provided for following filter, return empty array
        return { data: [] };
      }

      // Get list of users that the current user is following
      const follows = await this.followRepository
        .createQueryBuilder('follow')
        .where('follow.followerId = :userId', { userId })
        .leftJoinAndSelect('follow.following', 'following')
        .getMany();

      const followingUserIds = follows.map((follow) => follow.following.id);

      // If not following anyone, return empty array
      if (followingUserIds.length === 0) {
        return { data: [] };
      }

      // Filter posts to only show from followed users
      where = { user: { id: In(followingUserIds) } };
      order = { createdAt: 'DESC' };
    } else {
      // Default: newest posts first
      order = { createdAt: 'DESC' };
    }

    // Add category filter if categoryId is provided
    if (categoryId) {
      where = { ...where, category: { id: categoryId } };
    }

    const posts = await this.postRepository.find({
      where,
      relations: ['user', 'category'],
      select: this.selectFields,
      order,
    });
    return { data: posts };
  }

  async myPost(userId: string) {
    const posts = await this.postRepository.find({
      where: { user: { id: parseInt(userId) } },
      relations: ['user', 'category'],
      select: this.selectFields,
      order: { createdAt: 'DESC' },
    });
    return { data: posts };
  }

  async getPostsByCategory(categoryId: number) {
    const posts = await this.postRepository.find({
      where: { category: { id: categoryId } },
      relations: ['user', 'category'],
      select: this.selectFields,
      order: { createdAt: 'DESC' },
    });
    return { data: posts };
  }

  async getPromptsByType(type: string) {
    let where = {};
    let order = {};
    const take = 12;

    if (type === 'featured') {
      order = { copiesCount: 'DESC', createdAt: 'DESC' };
    } else if (type === 'trending') {
      order = { likesCount: 'DESC', createdAt: 'DESC' };
    } else if (type === 'thisWeek') {
      const now = new Date();
      const weekAgo = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 7,
      );
      where = { createdAt: MoreThanOrEqual(weekAgo) };
    }

    const posts = await this.postRepository.find({
      where,
      order,
      take,
      relations: ['user', 'category'],
      select: this.selectFields,
    });
    return { data: posts };
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user', 'category'],
      select: this.selectFields,
    });
    return { data: post };
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }

  async getLikedPosts(userId: string) {
    const likes = await this.likeRepository.find({
      where: { user: { id: parseInt(userId) } },
      relations: ['post', 'post.user', 'post.category'],
      order: { createdAt: 'DESC' },
    });

    const posts = likes.map((like) => ({
      id: like.post.id,
      title: like.post.title,
      prompt: like.post.prompt,
      image: like.post.image,
      price: like.post.price,
      model: like.post.model,
      likesCount: like.post.likesCount,
      sharesCount: like.post.sharesCount,
      copiesCount: like.post.copiesCount,
      ratingsCount: like.post.ratingsCount,
      ratingsValue: like.post.ratingsValue,
      createdAt: like.post.createdAt,
      user: {
        username: like.post.user.username,
        image: like.post.user.image,
      },
      category: {
        name: like.post.category.name,
      },
      likedAt: like.createdAt,
    }));

    return { data: posts };
  }
}
