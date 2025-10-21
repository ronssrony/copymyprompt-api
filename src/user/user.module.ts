import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Post } from '../posts/entities/post.entity';
import { Follow } from './entities/follow.entity';

@Module({
  imports: [
    // This line registers the User entity and makes its repository available for injection
    TypeOrmModule.forFeature([User, Post, Follow]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // Export if you want to use UserService in other modules
})
export class UserModule {}
