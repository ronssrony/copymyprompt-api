import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
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

  async findAll() {
    const posts = await this.postRepository.find({
      relations: ['user', 'category'],
      select: this.selectFields,
      order: { createdAt: 'DESC' },
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
    console.log('Getting posts by type', type);
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
    console.log('posts', posts);
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
}
