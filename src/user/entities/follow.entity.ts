import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_follows')
@Unique(['follower', 'following'])
export class Follow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  follower: User; // The user who is following

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  following: User; // The user being followed

  @CreateDateColumn()
  createdAt: Date;
}
