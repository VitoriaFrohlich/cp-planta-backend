import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { CreateCategoriesDto } from './dto/create.categories.dto';
import { UpdateCategoriesDto } from './dto/update.categories.dto';
import { CategoriesRepository } from './categories.repository';
import { categories } from '@prisma/client';
import { format } from 'date-fns';
import { SessionService } from '../common/sessionService';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly sessionService: SessionService,
    private readonly categoriesRepository: CategoriesRepository
  ) {}

  async create(createCategorysDto: CreateCategoriesDto) {
    const currentUser = this.sessionService.getCurrentUser();

    const createCategory = {
      ...createCategorysDto,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: currentUser,
      updated_by: currentUser
    };

    const createdCategory =
      await this.categoriesRepository.create(createCategory);

    return this.formatCategoryDate(createdCategory);
  }

  async findAll(orderBy: string): Promise<
    (Omit<categories, 'created_at' | 'updated_at'> & {
      created_at: string;
      updated_at: string;
    })[]
  > {
    const findedCategorys = await this.categoriesRepository.findAll(orderBy);
    return findedCategorys.map(category => this.formatCategoryDate(category));
  }

  async findById(id: number) {
    const category = await this.isValid(id);
    return this.formatCategoryDate(category);
  }

  private formatCategoryDate(category: categories): Omit<
    categories,
    'created_at' | 'updated_at'
  > & {
    created_at: string;
    updated_at: string;
  } {
    return {
      ...category,
      created_at: format(new Date(category.created_at), 'dd/MM/yyyy HH:mm:ss'),
      updated_at: format(new Date(category.updated_at), 'dd/MM/yyyy HH:mm:ss')
    };
  }

  async isValid(id: number) {
    const category = await this.categoriesRepository.findById(id);

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    } else if (!category.active) {
      throw new BadRequestException(`Category with ID ${id} is not active`);
    }
    return category;
  }

  async reactivateCategory(id: number) {
    const currentUser = this.sessionService.getCurrentUser();
    const category = await this.categoriesRepository.findById(id);

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    if (category.active) {
      throw new BadRequestException(`Category with ID ${id} is already active`);
    }
    return this.categoriesRepository.reactivate(id, currentUser);
  }

  async matchCategoryByData(description: string) {
    const matchedCategory =
      await this.categoriesRepository.matchCategoryByData(description);

    return matchedCategory.map(category => this.formatCategoryDate(category));
  }

  async update(id: number, updateCategoryDto: UpdateCategoriesDto) {
    const currentUser = this.sessionService.getCurrentUser();
    const category = await this.isValid(id);

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    const updatedCategorysDto = {
      ...updateCategoryDto,
      updated_at: new Date(),
      active: category.active,
      updated_by: currentUser
    };

    const updatedCategory = await this.categoriesRepository.update(
      id,
      updatedCategorysDto
    );

    return this.formatCategoryDate(updatedCategory);
  }

  remove(id: number) {
    const currentUser = this.sessionService.getCurrentUser();
    return this.categoriesRepository.delete(id, currentUser);
  }
}
