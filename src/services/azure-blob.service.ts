// src/services/azure-blob.service.ts
import { Injectable } from '@nestjs/common';
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AzureBlobService {
  private readonly containerName: any;
  private blobServiceClient: BlobServiceClient;

  constructor(private configService: ConfigService) {
    const connectionString = this.configService.get<string>(
      'AZURE_STORAGE_CONNECTION_STRING',
    );
    this.containerName = this.configService.get<string>(
      'AZURE_STORAGE_CONTAINER_NAME',
    );

    if (!connectionString) {
      throw new Error('Azure Storage connection string is not defined');
    }

    this.blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
  }

  async uploadImage(
    file: Express.Multer.File,
    fileName?: string,
  ): Promise<string> {
    // Generate unique filename if not provided
    const uploadFileName = fileName || `${Date.now()}-${file.originalname}`;

    // Get container client
    const containerClient = this.blobServiceClient.getContainerClient(
      this.containerName,
    );

    // Get blob client
    const blockBlobClient: BlockBlobClient =
      containerClient.getBlockBlobClient(uploadFileName);

    // Upload file
    await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: {
        blobContentType: file.mimetype,
      },
    });

    // Return the URL of uploaded file
    return blockBlobClient.url;
  }

  async deleteImage(fileName: string): Promise<void> {
    const containerClient = this.blobServiceClient.getContainerClient(
      this.containerName,
    );
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    await blockBlobClient.delete();
  }

  getImageUrl(fileName: string): string {
    const containerClient = this.blobServiceClient.getContainerClient(
      this.containerName,
    );
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    return blockBlobClient.url;
  }
}
