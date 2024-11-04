import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
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
import { CreateImagesDto } from './dto/create.images.dto';
import { UpdateImagesDto } from './dto/update.images.dto';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  async create(
    @Body() createImagesDto: CreateImagesDto
  ): Promise<ResponseImagesDto> {
    const createdImage = await this.imagesService.create(createImagesDto);
    return {
      id: createdImage.id,
      path: createdImage.path,
      created_at: createdImage.created_at
    };
  }

  @Get()
  async findAll(
    @Query('orderBy') orderBy: string = 'id',
    @Query('storage') storage: string
  ): Promise<ResponseImagesDto[]> {
    const validOrderFields = ['id', 'description'];
    const validStorage = ['products', 'steps', 'stock'];

    if (!validOrderFields.includes(orderBy)) {
      throw new BadRequestException(`Invalid order field: ${orderBy}`);
    }
    if (!validStorage.includes(storage)) {
      throw new BadRequestException(`Invalid storage field: ${storage}`);
    }

    const images = await this.imagesService.findAll(orderBy, storage);
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

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateImagesDto: UpdateImagesDto
  ): Promise<ResponseImagesDto> {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }

    const updatedImage = await this.imagesService.update(
      idNumber,
      updateImagesDto
    );
    return {
      id: updatedImage.id,
      hash: updatedImage.hash,
      path: updatedImage.path,
      mime_type: updatedImage.mime_type,
      size: updatedImage.size,
      created_at: updatedImage.created_at,
      updated_at: updatedImage.updated_at,
      file_name: updatedImage.file_name
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
    @Body('owner') owner: 'PRODUCTS' | 'STEPS' | 'STOCK' | 'OCCURRENCES'
  ) {
    const idNumber = +id;
    const validStorage = ['PRODUCTS', 'STEPS', 'STOCK', 'OCCURRENCES'];
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }
    if (!file) {
      throw new BadRequestException('No image provided');
    }
    if (!validStorage.includes(owner)) {
      throw new BadRequestException(`Invalid storage: ${owner}`);
    }

    const uploadedImage = await this.imagesService.uploadImage(file);
    return { message: 'Image uploaded successfully', file: uploadedImage };
  }
}
