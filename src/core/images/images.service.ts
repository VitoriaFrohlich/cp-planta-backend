import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { ImagesRepository } from './images.repository';
import { ConfigService } from '@nestjs/config';
import { images } from '@prisma/client';
import { format } from 'date-fns';
import { ResponseImagesDto } from './dto/response.images.dto';
import { CreateImagesDto } from './dto/create.images.dto';
import { $Enums } from '@prisma/client';
import { UpdateImagesDto } from './dto/update.images.dto';
import * as crypto from 'crypto';
import { s3Client } from 'src/config/s3.config';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const uploadParams = {
      Bucket: this.bucketName,
      Key: `${Date.now()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype
    };

    await s3Client.send(new PutObjectCommand(uploadParams));
    return this.generateFullPath(file.originalname);
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

  async create(createImagesDto: CreateImagesDto) {
    const id = undefined;
    const currentUser = this.getCurrentUser();
    const existingImage = await this.validateImage(id, createImagesDto);

    if (existingImage) {
      throw new BadRequestException(
        `Image already exists with ID: ${existingImage.id}`
      );
    }

    const imagesCreateInput = {
      ...createImagesDto,
      hash: this.calculateHash(createImagesDto),
      owner: createImagesDto.owner as unknown as $Enums.Owner,
      owner_id: createImagesDto.owner_id,
      mime_type: createImagesDto.mime_type,
      file_name: createImagesDto.file_name,
      original_name: createImagesDto.original_name,
      size: createImagesDto.size,
      width: createImagesDto.width,
      height: createImagesDto.height,
      metadata: createImagesDto.metadata,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: currentUser,
      updated_by: currentUser
    };
    const createdImage = await this.imagesRepository.create(imagesCreateInput);
    return this.formatDate(createdImage);
  }

  async findAll(
    orderBy: string,
    imageType: string
  ): Promise<
    (Omit<images, 'created_at' | 'updated_at'> & {
      created_at: string;
      updated_at: string;
      path: string;
    })[]
  > {
    const filteredImages = await this.imagesRepository.findAll(
      orderBy,
      imageType
    );
    return filteredImages.map(image => {
      const formattedImage = this.formatDate(image);
      const fullPath = this.generateFullPath(
        formattedImage.path || formattedImage.file_name
      );

      return {
        ...formattedImage,
        path: fullPath
      };
    });
  }

  async findById(id: number): Promise<ResponseImagesDto> {
    const image = await this.validateImage(id);
    if (!image) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }
    const formattedImage = this.formatDate(image);
    const fullPath = this.generateFullPath(
      formattedImage.path || formattedImage.file_name
    );

    return {
      id: formattedImage.id,
      hash: formattedImage.hash,
      path: fullPath,
      mime_type: formattedImage.mime_type,
      file_name: formattedImage.file_name,
      original_name: formattedImage.original_name,
      size: formattedImage.size,
      width: formattedImage.width,
      height: formattedImage.height,
      created_at: formattedImage.created_at,
      updated_at: formattedImage.updated_at
    };
  }

  private async validateImage(
    id: number,
    imageObject?: Buffer | CreateImagesDto | UpdateImagesDto
  ): Promise<images | null> {
    const image = await this.imagesRepository.findById(id);

    if (!image && imageObject) {
      const hash = this.calculateHash(imageObject);
      const duplicated = await this.imagesRepository.findByHash(hash);

      if (duplicated) {
        throw new BadRequestException(
          `Image with provided data is the same as image with ID ${duplicated.id}`
        );
      }
      return null;
    }
    return image;
  }

  private calculateHash(
    imageObject: Buffer | CreateImagesDto | UpdateImagesDto
  ): string {
    const buffer = Buffer.isBuffer(imageObject)
      ? imageObject
      : Buffer.from('base64');
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  async update(id: number, updateImageDto: UpdateImagesDto) {
    const currentUser = this.getCurrentUser();
    const image = await this.validateImage(id, updateImageDto);
    if (!image) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }

    const updatedImage = await this.imagesRepository.update(id, {
      ...updateImageDto,
      updated_at: new Date(),
      updated_by: currentUser
    });

    return this.formatDate(updatedImage);
  }

  async delete(id: number) {
    const image = await this.validateImage(id);
    if (!image) {
      throw new NotFoundException(`Image with ID ${id} not found`);
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
