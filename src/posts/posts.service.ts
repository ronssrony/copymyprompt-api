import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}
  create(createPostDto: CreatePostDto) {
    const post = this.postRepository.create(createPostDto);
    return this.postRepository.save(post);
  }

  async findAll() {
    const posts = await this.postRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
    return { data: posts };
  }

  async myPost(userId: string) {
    const posts = await this.postRepository.find({
      where: { user: { id: parseInt(userId) } },
      relations: ['user', 'category'],
      select: {
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
      },
      order: { createdAt: 'DESC' },
    });
    return { data: posts };
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
