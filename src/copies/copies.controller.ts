import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CopiesService } from './copies.service';
import { CreateCopyDto } from './dto/create-copy.dto';
import { UpdateCopyDto } from './dto/update-copy.dto';

@Controller('copies')
export class CopiesController {
  constructor(private readonly copiesService: CopiesService) {}

  @Post()
  create(@Body() createCopyDto: CreateCopyDto) {
    return this.copiesService.create(createCopyDto);
  }

  @Get()
  findAll() {
    return this.copiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.copiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCopyDto: UpdateCopyDto) {
    return this.copiesService.update(+id, updateCopyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.copiesService.remove(+id);
  }
}
