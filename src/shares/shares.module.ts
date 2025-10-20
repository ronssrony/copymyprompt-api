import { Module } from '@nestjs/common';
import { SharesService } from './shares.service';
import { SharesController } from './shares.controller';
import { Share } from './entities/share.entity';
import { Post } from '../posts/entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Share, Post])],
  controllers: [SharesController],
  providers: [SharesService],
})
export class SharesModule {}
