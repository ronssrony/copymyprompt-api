import { Module } from '@nestjs/common';
import { CopiesService } from './copies.service';
import { CopiesController } from './copies.controller';

@Module({
  controllers: [CopiesController],
  providers: [CopiesService],
})
export class CopiesModule {}
