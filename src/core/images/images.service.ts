import {
  BadRequestException,
  Injectable,
  NotFoundException,
  InternalServerErrorException
} from '@nestjs/common';
import { ImagesRepository } from './images.repository';
import { ConfigService } from '@nestjs/config';
import { images } from '@prisma/client';
import { format } from 'date-fns';
import { ResponseImagesDto } from './dto/response.images.dto';
import { CreateImagesDto } from './dto/create.images.dto';
import { UpdateImagesDto } from './dto/update.images.dto';
import * as crypto from 'crypto';
import { s3Client } from 'src/config/s3.config';
import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import sharp from 'sharp';
import { Owner } from 'prisma/prisma-client';

@Injectable()
export class ImagesService {
  private bucketName: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly imagesRepository: ImagesRepository
  ) {
    this.bucketName = this.configService.get<string>('AWS_BUCKET_NAME');
  }

  private getCurrentUser(): string {
    //TODO: Implementar busca do usuário logado
    return 'root';
  }

  async uploadImage(
    owner: string,
    owner_id: number,
    file: Express.Multer.File
  ): Promise<ResponseImagesDto> {
    const formattedOwner = owner.toUpperCase();
    const validStorage = [
      'PRODUCT',
      'PRODUCTION_STEP',
      'STOCK_ITEM',
      'OCCURRENCE'
    ];
    if (!validStorage.includes(formattedOwner)) {
      throw new BadRequestException(`Invalid storage: ${formattedOwner}`);
    }
    const currentUser = this.getCurrentUser();
    const hash = this.calculateHash(file.buffer);

    const existingImage = await this.imageAlreadyExists(hash);
    if (existingImage) {
      throw new BadRequestException(
        `Image already exists with ID: ${existingImage.id}`
      );
    }

    const uploadParams = {
      Bucket: this.bucketName,
      Key: hash,
      Body: file.buffer,
      ContentType: file.mimetype
    };

    await s3Client.send(new PutObjectCommand(uploadParams));
    const path = this.generateFullPath(hash);

    const image = sharp(file.buffer);
    const metadata = await image.metadata();
    const width = metadata.width || 0;
    const height = metadata.height || 0;

    const imagesCreateInput = {
      hash: hash,
      path: path,
      owner: Owner[formattedOwner],
      owner_id: owner_id,
      mime_type: file.mimetype,
      file_name: hash,
      original_name: file.originalname,
      size: file.size,
      width: width,
      height: height,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: currentUser,
      updated_by: currentUser
    };
    const createdImage = await this.imagesRepository.create(imagesCreateInput);

    return this.formatDate(createdImage);
  }

  async getImageUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key
    });

    return getSignedUrl(s3Client, command, { expiresIn: 3600 });
  }

  private generateFullPath(key: string): string {
    const bucketBaseUrl = `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
    return `${bucketBaseUrl}${key}`;
  }

  async findAll(
    owner: string,
    ownerId: number
  ): Promise<
    (Omit<images, 'created_at' | 'updated_at'> & {
      created_at: string;
      updated_at: string;
      path: string;
    })[]
  > {
    const filteredImages = await this.imagesRepository.findAll(
      owner.toUpperCase(),
      ownerId
    );

    const result = [];

    for (const image of filteredImages) {
      const formattedImage = this.formatDate(image);

      const params = {
        Bucket: this.bucketName,
        Key: image.hash
      };

      try {
        const command = new GetObjectCommand(params);
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        result.push({
          ...formattedImage,
          path: url
        });
      } catch (error) {
        console.error(
          `Error generating signed URL for image with ID ${image.id}:`,
          error
        );
        throw new InternalServerErrorException(
          'Failed to generate signed URL for image'
        );
      }
    }

    return result;
  }

  async findById(id: number): Promise<ResponseImagesDto> {
    const image = await this.imagesRepository.findById(id);
    if (!image) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }

    const params = {
      Bucket: this.bucketName,
      Key: image.hash
    };

    try {
      const command = new GetObjectCommand(params);
      const response = await s3Client.send(command);

      if (response) {
        const command = new GetObjectCommand(params);
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        const finded = await this.formatDate(image);
        return {
          ...finded,
          path: url
        };
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Failed to find image in S3: ${error.message}`);
      } else {
        console.error('Failed to find image in S3: Unknown error');
      }
      throw new InternalServerErrorException('Failed to find image in S3');
    }
  }

  private async imageAlreadyExists(hash: string): Promise<images | null> {
    if (hash) {
      const duplicated = await this.imagesRepository.findByHash(hash);

      if (duplicated) {
        throw new BadRequestException(
          `Image with provided data is the same as image with ID ${duplicated.id}`
        );
      }
      return duplicated;
    }
    return null;
  }

  private calculateHash(
    imageObject: Buffer | CreateImagesDto | UpdateImagesDto
  ): string {
    const buffer = Buffer.isBuffer(imageObject)
      ? imageObject
      : Buffer.from('base64');
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  async delete(id: number) {
    const image = await this.imagesRepository.findById(id);
    if (!image) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }

    const deleteParams = {
      Bucket: this.bucketName,
      Key: image.hash
    };

    try {
      await s3Client.send(new DeleteObjectCommand(deleteParams));
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Failed to delete image from S3: ${error.message}`);
      } else {
        console.error('Failed to delete image from S3: Unknown error');
      }
      throw new InternalServerErrorException('Failed to delete image from S3');
    }

    return this.imagesRepository.delete(id);
  }

  private formatDate(image: images): Omit<
    images,
    'created_at' | 'updated_at'
  > & {
    created_at: string;
    updated_at: string;
  } {
    return {
      ...image,
      created_at: format(new Date(image.created_at), 'dd/MM/yyyy HH:mm:ss'),
      updated_at: format(new Date(image.updated_at), 'dd/MM/yyyy HH:mm:ss')
    };
  }
}
