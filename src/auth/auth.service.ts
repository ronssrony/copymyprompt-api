import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import configuration from '../config/configuration';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    const token = this.generateToken(existingUser?.id.toString());
    if (existingUser) {
      return {
        user: { ...existingUser, password: undefined },
        token,
      };
    }
    const user = this.userRepository.create(createUserDto);
    const tokenNew = this.generateToken(user.id?.toString());
    const newUser = await this.userRepository.save(user);
    return {
      user: { ...newUser, password: undefined },
      token: tokenNew,
    };
  }
  generateToken(userId: string | undefined) {
    console.log('register userId', userId);
    return this.jwtService.sign(
      { userId },
      { expiresIn: configuration().jwt.expiresIn },
    );
  }
}
