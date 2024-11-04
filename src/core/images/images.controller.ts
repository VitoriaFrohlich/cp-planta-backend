import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from './images.service';
import * as multer from 'multer';
import { ResponseImagesDto } from './dto/response.images.dto';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get()
  async findAll(
    @Query('owner') owner: string,
    @Query('owner_id') ownerId: string
  ): Promise<ResponseImagesDto[]> {
    const formattedOwner = owner.toUpperCase();
    const validStorage = [
      'PRODUCT',
      'PRODUCTION_STEP',
      'STOCK_ITEM',
      'OCCURRENCE'
    ];

    if (!validStorage.includes(formattedOwner)) {
      throw new BadRequestException(`Invalid storage field: ${formattedOwner}`);
    }
    if (!ownerId) {
      throw new BadRequestException('Owner ID is required');
    }
    const idNumber = +ownerId;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }

    const images = await this.imagesService.findAll(formattedOwner, +ownerId);

    return images.map(image => ({
      id: image.id,
      path: image.path
    }));
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ResponseImagesDto> {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }

    const image = await this.imagesService.findById(idNumber);
    return {
      id: image.id,
      hash: image.hash,
      path: image.path,
      mime_type: image.mime_type,
      size: image.size,
      created_at: image.created_at,
      updated_at: image.updated_at,
      file_name: image.file_name
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }

    await this.imagesService.delete(idNumber);
    return { message: `Image with ID ${idNumber} deleted successfully` };
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return callback(
            new BadRequestException('Apenas imagens são permitidas'),
            false
          );
        }
        callback(null, true);
      }
    })
  )
  async uploadImg(
    @UploadedFile() file: Express.Multer.File,
    @Body('owner_id') id: string,
    @Body('owner') owner: string
  ) {
    const idNumber = +id;
    const formattedOwner = owner.toUpperCase();
    const validStorage = [
      'PRODUCT',
      'PRODUCTION_STEP',
      'STOCK_ITEM',
      'OCCURRENCE'
    ];
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }
    if (!file) {
      throw new BadRequestException('No image provided');
    }
    if (!validStorage.includes(formattedOwner)) {
      throw new BadRequestException(`Invalid storage: ${formattedOwner}`);
    }

    const uploadedImage = await this.imagesService.uploadImage(
      owner,
      idNumber,
      file
    );
    return { message: 'Image uploaded successfully', file: uploadedImage };
  }
}
