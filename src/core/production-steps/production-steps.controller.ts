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
import { ProductionStepsService } from './production-steps.service';
import { CreateProductionStepsDto } from './dto/create.production-steps.dto';
import { UpdateProductionStepsDto } from './dto/update.production-steps.dto';
import { ResponseProductionStepsDto } from './dto/response.production-steps.dto';

@Controller('steps')
export class ProductionStepsController {
  constructor(private readonly categoriesService: ProductionStepsService) {}

  @Post()
  async create(
    @Body() createProductionStepsDto: CreateProductionStepsDto
  ): Promise<ResponseProductionStepsDto> {
    const matchedProductionSteps = await this.categoriesService.matchByData(
      createProductionStepsDto.description
    );

    if ((await matchedProductionSteps).length > 0) {
      const existingProductionStep = matchedProductionSteps[0];

      if (!existingProductionStep.active) {
        throw new BadRequestException(
          `ProductionStep already exists but is not active. Activate and update it: ${JSON.stringify(
            existingProductionStep
          )}`
        );
      }

      throw new BadRequestException(
        'ProductionStep already exists. Try update it instead'
      );
    }

    const createdProductionStep = await this.categoriesService.create(
      createProductionStepsDto
    );
    return {
      id: createdProductionStep.id,
      description: createdProductionStep.description,
      created_at: createdProductionStep.created_at,
      updated_at: createdProductionStep.updated_at
    };
  }

  @Get()
  async findAll(
    @Query('orderBy') orderBy: string = 'id'
  ): Promise<ResponseProductionStepsDto[]> {
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
  async findById(@Param('id') id: string): Promise<ResponseProductionStepsDto> {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }

    const category = await this.categoriesService.findById(idNumber);

    const response: ResponseProductionStepsDto = {
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
    @Body() updateProductionStepsDto: UpdateProductionStepsDto
  ): Promise<ResponseProductionStepsDto> {
    const idNumber = +id;
    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }

    const existingProductionStep =
      await this.categoriesService.findById(idNumber);
    if (!existingProductionStep) {
      throw new NotFoundException(`ProductionStep with ID ${id} not found`);
    }

    if (!existingProductionStep.active) {
      throw new BadRequestException(`ProductionStep ID ${id} is not active`);
    }

    const updatedProductionStep = await this.categoriesService.update(
      idNumber,
      updateProductionStepsDto
    );

    return {
      id: updatedProductionStep.id,
      description: updatedProductionStep.description,

      created_at: updatedProductionStep.created_at,
      updated_at: updatedProductionStep.updated_at
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const idNumber = +id;

    if (isNaN(idNumber)) {
      throw new BadRequestException('Invalid ID format');
    }

    const existingProductionStep =
      await this.categoriesService.findById(idNumber);
    if (!existingProductionStep) {
      throw new NotFoundException(
        `ProductionStep with ID ${idNumber} not found`
      );
    }

    try {
      await this.categoriesService.remove(idNumber);

      return {
        message: `ProductionStep with ID ${idNumber} deleted successfully`
      };
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

    await this.categoriesService.reactivateProductionStep(idNumber);

    return { message: `ProductionStep ID ${id} activated successfully` };
  }
}
