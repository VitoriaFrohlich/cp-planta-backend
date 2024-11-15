/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ResponseCategoriesDto } from './dto/response.categories.dto';
import { CreateCategoriesDto } from './dto/create.categories.dto';
import { UpdateCategoriesDto } from './dto/update.categories.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(
    @Body() createCategoriesDto: CreateCategoriesDto
  ): Promise<ResponseCategoriesDto> {
    const matchedCategories = await this.categoriesService.matchCategoryByData(
      createCategoriesDto.description
    );

    if ((await matchedCategories).length > 0) {
      const existingCategory = matchedCategories[0];

      if (!existingCategory.active) {
        throw new BadRequestException(
          `Category already exists but is not active. Activate and update it: ${JSON.stringify(
            existingCategory
          )}`
        );
      }

      throw new BadRequestException(
        'Category already exists. Try update it instead'
      );
    }
    const createdCategory =
      await this.categoriesService.create(createCategoriesDto);
    return {
      id: createdCategory.id,
      description: createdCategory.description,
      created_at: createdCategory.created_at,
      updated_at: createdCategory.updated_at
    };
  }

  @Get()
  async findAll(
    @Query('orderBy') orderBy: string = 'id'
  ): Promise<ResponseCategoriesDto[]> {
    const validOrderFields = ['id', 'description'];

    if (!validOrderFields.includes(orderBy)) {
      throw new BadRequestException(`Invalid order field: ${orderBy}`);
    }

    const categories = await this.categoriesService.findAll(orderBy);
    return categories.map(category => ({
      id: category.id,
      description: category.description,
      created_at: category.created_at,
      updated_at: category.updated_at
    }));
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ResponseCategoriesDto> {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }

    const category = await this.categoriesService.findById(idNumber);

    const response: ResponseCategoriesDto = {
      id: category.id,
      description: category.description,
      created_at: category.created_at,
      updated_at: category.updated_at
    };

    return response;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoriesDto: UpdateCategoriesDto
  ): Promise<ResponseCategoriesDto> {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }

    const existingCategory = await this.categoriesService.findById(idNumber);
    if (!existingCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    if (!existingCategory.active) {
      throw new BadRequestException(`Category ID ${id} is not active`);
    }

    const updatedCategory = await this.categoriesService.update(
      idNumber,
      updateCategoriesDto
    );

    return {
      id: updatedCategory.id,
      description: updatedCategory.description,
      created_at: updatedCategory.created_at,
      updated_at: updatedCategory.updated_at
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const idNumber = +id;

    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }

    const existingCategory = await this.categoriesService.findById(idNumber);
    if (!existingCategory) {
      throw new NotFoundException(`Category with ID ${idNumber} not found`);
    }

    try {
      await this.categoriesService.remove(idNumber);

      return { message: `Category with ID ${idNumber} deleted successfully` };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  @Post('activate/:id')
  async activate(@Param('id') id: string) {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }

    await this.categoriesService.reactivateCategory(idNumber);

    return { message: `Category ID ${id} activated successfully` };
  }
}
