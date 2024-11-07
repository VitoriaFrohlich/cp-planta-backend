import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { CreateProductionStepsDto } from './dto/create.production-steps.dto';
import { UpdateProductionStepsDto } from './dto/update.production-steps.dto';
import { ProductionStepsRepository } from './production-steps.repository';
import { production_order_steps } from '@prisma/client';
import { format } from 'date-fns';
import { SessionService } from '../common/sessionService';

@Injectable()
export class ProductionStepsService {
  constructor(
    private readonly sessionService: SessionService,
    private readonly productionStepsRepository: ProductionStepsRepository
  ) {}

  async create(createProductionStepsDto: CreateProductionStepsDto) {
    const currentUser = this.sessionService.getCurrentUser();

    const createProductionSteps = {
      ...createProductionStepsDto,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: currentUser,
      updated_by: currentUser
    };

    const createdProductionStep = await this.productionStepsRepository.create(
      createProductionSteps
    );

    return this.formatProductionStepDate(createdProductionStep);
  }

  async findAll(orderBy: string): Promise<
    (Omit<production_order_steps, 'created_at' | 'updated_at'> & {
      created_at: string;
      updated_at: string;
    })[]
  > {
    const findedProductionSteps =
      await this.productionStepsRepository.findAll(orderBy);
    return findedProductionSteps.map(productionStep =>
      this.formatProductionStepDate(productionStep)
    );
  }

  async findById(id: number) {
    const productionStep = await this.isValid(id);
    return this.formatProductionStepDate(productionStep);
  }

  private formatProductionStepDate(
    productionStep: production_order_steps
  ): Omit<production_order_steps, 'created_at' | 'updated_at'> & {
    created_at: string;
    updated_at: string;
  } {
    return {
      ...productionStep,
      created_at: format(
        new Date(productionStep.created_at),
        'dd/MM/yyyy HH:mm:ss'
      ),
      updated_at: format(
        new Date(productionStep.updated_at),
        'dd/MM/yyyy HH:mm:ss'
      )
    };
  }

  async isValid(id: number) {
    const productionStep = await this.productionStepsRepository.findById(id);

    if (!productionStep) {
      throw new NotFoundException(`ProductionStep with ID ${id} not found`);
    } else if (!productionStep.active) {
      throw new BadRequestException(
        `ProductionStep with ID ${id} is not active`
      );
    }
    return productionStep;
  }

  async reactivateProductionStep(id: number) {
    const currentUser = this.sessionService.getCurrentUser();
    const productionStep = await this.productionStepsRepository.findById(id);

    if (!productionStep) {
      throw new NotFoundException(`ProductionStep with ID ${id} not found`);
    }

    if (productionStep.active) {
      throw new BadRequestException(
        `ProductionStep with ID ${id} is already active`
      );
    }
    return this.productionStepsRepository.reactivate(id, currentUser);
  }

  async matchByData(description: string) {
    const matchedProductionStep =
      await this.productionStepsRepository.matchByData(description);

    return matchedProductionStep.map(productionStep =>
      this.formatProductionStepDate(productionStep)
    );
  }

  async update(id: number, updateProductionStepDto: UpdateProductionStepsDto) {
    const currentUser = this.sessionService.getCurrentUser();
    const productionStep = await this.isValid(id);

    if (!productionStep) {
      throw new NotFoundException(`ProductionStep with ID ${id} not found`);
    }
    const updatedProductionStepsDto = {
      ...updateProductionStepDto,
      updated_at: new Date(),
      active: productionStep.active,
      updated_by: currentUser
    };

    const updatedProductionStep = await this.productionStepsRepository.update(
      id,
      updatedProductionStepsDto
    );

    return this.formatProductionStepDate(updatedProductionStep);
  }

  remove(id: number) {
    const currentUser = this.sessionService.getCurrentUser();
    return this.productionStepsRepository.delete(id, currentUser);
  }
}
