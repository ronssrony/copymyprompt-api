// src/modules/upload.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AzureBlobService } from '../services/azure-blob.service';
import { UploadController } from './upload.controller';

@Module({
  imports: [ConfigModule],
  controllers: [UploadController],
  providers: [AzureBlobService],
  exports: [AzureBlobService],
})
export class UploadModule {}
