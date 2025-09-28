import { Injectable } from '@nestjs/common';
import { CreateCopyDto } from './dto/create-copy.dto';
import { UpdateCopyDto } from './dto/update-copy.dto';

@Injectable()
export class CopiesService {
  create(createCopyDto: CreateCopyDto) {
    return 'This action adds a new copy';
  }

  findAll() {
    return `This action returns all copies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} copy`;
  }

  update(id: number, updateCopyDto: UpdateCopyDto) {
    return `This action updates a #${id} copy`;
  }

  remove(id: number) {
    return `This action removes a #${id} copy`;
  }
}
