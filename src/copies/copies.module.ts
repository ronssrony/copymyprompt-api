import { Module } from '@nestjs/common';
import { CopiesService } from './copies.service';
import { CopiesController } from './copies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Copies } from './entities/copy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Copies])],
  controllers: [CopiesController],
  providers: [CopiesService],
})
export class CopiesModule {}
