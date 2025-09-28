import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { User } from '../../user/entities/user.entity';

@Entity('post_ratings')
@Unique(['post', 'user'])
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post, (post) => post.ratings, { onDelete: 'CASCADE' })
  post: Post;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'int' })
  value: number; // rating 1-5

  @Column({ type: 'text', nullable: true })
  body: string; // optional review

  @CreateDateColumn()
  createdAt: Date;
}
