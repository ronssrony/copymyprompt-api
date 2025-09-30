import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { PostsModule } from './posts/posts.module';
import { LikesModule } from './likes/likes.module';
import { SharesModule } from './shares/shares.module';
import { CopiesModule } from './copies/copies.module';
import { RatingsModule } from './ratings/ratings.module';
import { Post } from './posts/entities/post.entity';
import { Category } from './categories/entities/category.entity';
import { Copies } from './copies/entities/copy.entity';
import { Like } from './likes/entities/like.entity';
import { Rating } from './ratings/entities/rating.entity';
import { Share } from './shares/entities/share.entity';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        logging: configService.get('NODE_ENV') === 'development',
        entities: [User, Post, Category, Copies, Like, Rating, Share],
        // Add SSL configuration for production
        ssl: true,
        // Add connection options for production
        extra:
          configService.get('NODE_ENV') === 'production'
            ? {
                connectionLimit: 10,
              }
            : {},
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    CategoriesModule,
    PostsModule,
    LikesModule,
    SharesModule,
    CopiesModule,
    RatingsModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
