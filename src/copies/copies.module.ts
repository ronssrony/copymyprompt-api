import { Module } from '@nestjs/common';
import { CopiesService } from './copies.service';
import { CopiesController } from './copies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Copies } from './entities/copy.entity';
import { Post } from '../posts/entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Copies, Post])],
  controllers: [CopiesController],
  providers: [CopiesService],
})
export class CopiesModule {}
