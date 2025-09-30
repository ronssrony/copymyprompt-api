// src/controllers/upload.controller.ts
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AzureBlobService } from '../services/azure-blob.service';

@Controller()
export class UploadController {
  constructor(private readonly azureBlobService: AzureBlobService) {}

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({
            fileType: /^image\/(jpeg|jpg|png|gif|webp)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    try {
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      const imageUrl = await this.azureBlobService.uploadImage(file);

      return {
        success: true,
        message: 'Image uploaded successfully',
        data: {
          url: imageUrl,
          fileName: file.originalname,
          size: file.size,
          mimeType: file.mimetype,
        },
      };
    } catch (error) {
      throw new BadRequestException(`Failed to upload image: ${error.message}`);
    }
  }

  // Optional: Multiple file upload
  @Post('upload-multiple-images')
  @UseInterceptors(FileInterceptor('images'))
  async uploadMultipleImages(@UploadedFile() files: Express.Multer.File[]) {
    try {
      if (!files || files.length === 0) {
        throw new BadRequestException('No files uploaded');
      }

      const uploadPromises = files.map((file) =>
        this.azureBlobService.uploadImage(file),
      );
      const urls = await Promise.all(uploadPromises);

      return {
        success: true,
        message: 'Images uploaded successfully',
        data: urls.map((url, index) => ({
          url,
          fileName: files[index].originalname,
        })),
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to upload images: ${error.message}`,
      );
    }
  }
}
