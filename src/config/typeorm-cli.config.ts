import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User } from '../user/entities/user.entity';
import { InitialSchema1758471223836 } from '../migrations/intialSchema';
import { PostsSchema1758475550000 } from '../migrations/postsSchema';
import { Post } from '../posts/entities/post.entity';
import { Category } from '../categories/entities/category.entity';
import { Copies } from '../copies/entities/copy.entity';
import { Like } from '../likes/entities/like.entity';
import { Rating } from '../ratings/entities/rating.entity';
import { Share } from '../shares/entities/share.entity';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  logging: configService.get<boolean>('DB_LOGGING'),
  ssl: true,
  entities: [User, Post, Category, Copies, Like, Rating, Share],
  migrations: [InitialSchema1758471223836, PostsSchema1758475550000],
});
