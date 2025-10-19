import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { User } from '../../user/entities/user.entity';

@Entity('post_shares')
@Unique(['post', 'user'])
export class Share {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post, (post) => post.shares, { onDelete: 'CASCADE' })
  post: Post;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
