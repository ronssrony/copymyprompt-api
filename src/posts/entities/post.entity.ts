import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Like } from '../../likes/entities/like.entity';
import { Share } from '../../shares/entities/share.entity';
import { Copies } from '../../copies/entities/copy.entity';
import { Rating } from '../../ratings/entities/rating.entity';
import { User } from '../../user/entities/user.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ type: 'text' })
  prompt: string;

  @Column({ type: 'text' })
  image: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ length: 100, nullable: true })
  model: string;

  @ManyToOne(() => Category, (category) => category.posts, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  category: Category;

  @Column({ type: 'number', nullable: true })
  categoryId: number;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'number', nullable: true })
  userId: number;

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @OneToMany(() => Share, (share) => share.post)
  shares: Share[];

  @OneToMany(() => Copies, (copy) => copy.post)
  copies: Copies[];

  @OneToMany(() => Rating, (rating) => rating.post)
  ratings: Rating[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
