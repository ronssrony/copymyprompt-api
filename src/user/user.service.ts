import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './entities/user.entity';
import { Follow } from './entities/follow.entity';
import { Post } from '../posts/entities/post.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepository.create(createUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        // Unique constraint violation
        throw new ConflictException('Username or email already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id); // This will throw if not found

    try {
      await this.userRepository.update(id, updateUserDto);
      return await this.findOne(id);
    } catch (error) {
      if (error.code === '23505') {
        // Unique constraint violation
        throw new ConflictException('Username or email already exists');
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id); // This will throw if not found
    await this.userRepository.remove(user);
  }

  // Follow a user
  async followUser(followerId: number, followingId: number) {
    // Check if trying to follow self
    if (followerId === followingId) {
      throw new ConflictException('You cannot follow yourself');
    }

    // Check if both users exist
    const follower = await this.findOne(followerId);
    const following = await this.findOne(followingId);

    // Check if already following
    const existingFollow = await this.followRepository.findOne({
      where: {
        follower: { id: followerId },
        following: { id: followingId },
      },
    });

    if (existingFollow) {
      throw new ConflictException('You are already following this user');
    }

    // Create follow
    const follow = this.followRepository.create({
      follower: { id: followerId },
      following: { id: followingId },
    });
    const savedFollow = await this.followRepository.save(follow);

    // Increment counters
    await this.userRepository.increment({ id: followerId }, 'followingCount', 1);
    await this.userRepository.increment(
      { id: followingId },
      'followersCount',
      1,
    );

    return {
      data: savedFollow,
      message: 'User followed successfully',
    };
  }

  // Unfollow a user
  async unfollowUser(followerId: number, followingId: number) {
    const follow = await this.followRepository.findOne({
      where: {
        follower: { id: followerId },
        following: { id: followingId },
      },
    });

    if (!follow) {
      throw new NotFoundException('You are not following this user');
    }

    await this.followRepository.remove(follow);

    // Decrement counters
    await this.userRepository.decrement({ id: followerId }, 'followingCount', 1);
    await this.userRepository.decrement(
      { id: followingId },
      'followersCount',
      1,
    );

    return {
      message: 'User unfollowed successfully',
    };
  }

  // Get users that the current user is following
  async getFollowing(userId: number) {
    const follows = await this.followRepository.find({
      where: { follower: { id: userId } },
      relations: ['following'],
      order: { createdAt: 'DESC' },
    });

    const followingUsers = follows.map((follow) => ({
      id: follow.following.id,
      username: follow.following.username,
      image: follow.following.image,
      bio: follow.following.bio,
      followersCount: follow.following.followersCount,
      followedAt: follow.createdAt,
    }));

    return { data: followingUsers };
  }

  // Get users following the current user
  async getFollowers(userId: number) {
    const follows = await this.followRepository.find({
      where: { following: { id: userId } },
      relations: ['follower'],
      order: { createdAt: 'DESC' },
    });

    const followers = follows.map((follow) => ({
      id: follow.follower.id,
      username: follow.follower.username,
      image: follow.follower.image,
      bio: follow.follower.bio,
      followersCount: follow.follower.followersCount,
      followedAt: follow.createdAt,
    }));

    return { data: followers };
  }

  // Check if user is following another user
  async checkFollowing(followerId: number, followingId: number) {
    const follow = await this.followRepository.findOne({
      where: {
        follower: { id: followerId },
        following: { id: followingId },
      },
    });

    return {
      data: {
        isFollowing: !!follow,
        follow,
      },
    };
  }

  // Get user profile with posts count
  async getProfile(userId: number, currentUserId?: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['posts'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const profile = {
      id: user.id,
      username: user.username,
      image: user.image,
      bio: user.bio,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      postsCount: user.posts.length,
      createdAt: user.createdAt,
    };

    // If currentUserId is provided, check if the current user is following this profile
    if (currentUserId && currentUserId !== userId) {
      const followStatus = await this.checkFollowing(currentUserId, userId);
      return {
        data: {
          ...profile,
          isFollowing: followStatus.data.isFollowing,
        },
      };
    }

    return { data: profile };
  }

  // Update user profile (username, bio, image only)
  // Added: 2025-10-21
  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    const user = await this.findOne(userId);

    try {
      // Only update the fields that are provided
      await this.userRepository.update(userId, updateProfileDto);
      const updatedUser = await this.findOne(userId);

      return {
        data: {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          image: updatedUser.image,
          bio: updatedUser.bio,
          followersCount: updatedUser.followersCount,
          followingCount: updatedUser.followingCount,
        },
        message: 'Profile updated successfully',
      };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      }
      throw error;
    }
  }

  // Get top creators based on criteria
  // Added: 2025-10-21
  async getTopCreators(sortBy: 'posts' | 'followers' | 'copies' = 'posts') {
    let queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.posts', 'post')
      .select([
        'user.id',
        'user.username',
        'user.image',
        'user.bio',
        'user.followersCount',
        'user.followingCount',
      ]);

    if (sortBy === 'posts') {
      // Sort by number of posts
      queryBuilder = queryBuilder
        .loadRelationCountAndMap('user.postsCount', 'user.posts')
        .orderBy('user.postsCount', 'DESC');
    } else if (sortBy === 'followers') {
      // Sort by followers count
      queryBuilder = queryBuilder.orderBy('user.followersCount', 'DESC');
    } else if (sortBy === 'copies') {
      // Sort by total copies count (sum of all posts' copies)
      queryBuilder = queryBuilder
        .addSelect('SUM(post.copiesCount)', 'totalCopies')
        .groupBy('user.id')
        .orderBy('totalCopies', 'DESC');
    }

    const users = await queryBuilder.take(10).getMany();

    // Calculate postsCount and totalCopies for each user
    const topCreators = await Promise.all(
      users.map(async (user) => {
        const postsCount = await this.postRepository.count({
          where: { user: { id: user.id } },
        });

        const posts = await this.postRepository.find({
          where: { user: { id: user.id } },
          select: ['copiesCount'],
        });

        const totalCopies = posts.reduce(
          (sum, post) => sum + post.copiesCount,
          0,
        );

        return {
          id: user.id,
          username: user.username,
          image: user.image,
          bio: user.bio,
          followersCount: user.followersCount,
          followingCount: user.followingCount,
          postsCount,
          totalCopies,
        };
      }),
    );

    // Sort based on the criteria
    if (sortBy === 'posts') {
      topCreators.sort((a, b) => b.postsCount - a.postsCount);
    } else if (sortBy === 'copies') {
      topCreators.sort((a, b) => b.totalCopies - a.totalCopies);
    }

    return { data: topCreators };
  }

  // Get user profile with all their posts
  // Added: 2025-10-21
  async getProfileWithPosts(userId: number, currentUserId?: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['posts', 'posts.category', 'posts.user'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Format posts to match the expected structure
    const posts = user.posts.map((post) => ({
      id: post.id,
      title: post.title,
      prompt: post.prompt,
      image: post.image,
      price: post.price,
      model: post.model,
      likesCount: post.likesCount,
      sharesCount: post.sharesCount,
      copiesCount: post.copiesCount,
      ratingsCount: post.ratingsCount,
      ratingsValue: post.ratingsValue,
      createdAt: post.createdAt,
      category: {
        name: post.category.name,
      },
    }));

    const profile = {
      id: user.id,
      username: user.username,
      image: user.image,
      bio: user.bio,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      postsCount: user.posts.length,
      createdAt: user.createdAt,
      posts,
    };

    // If currentUserId is provided, check if the current user is following this profile
    if (currentUserId && currentUserId !== userId) {
      const followStatus = await this.checkFollowing(currentUserId, userId);
      return {
        data: {
          ...profile,
          isFollowing: followStatus.data.isFollowing,
        },
      };
    }

    return { data: profile };
  }
}
