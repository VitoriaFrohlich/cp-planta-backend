import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { CreateCompositionsDto } from './dto/create.compositions.dto';
import { ResponseCompositionsDto } from './dto/response.compositions.dto';
import { UpdateCompositionsDto } from './dto/update.compositions.dto';
import { CompositionsRepository } from './compositions.repository';
import { Origin } from '../common/enums';
import { SessionService } from '../common/sessionService';
import { formatDate } from '../common/utils';

@Injectable()
export class CompositionsService {
  constructor(
    private readonly sessionService: SessionService,
    private readonly compositionsRepository: CompositionsRepository
  ) {}

  async create(createCompositionsDto: CreateCompositionsDto) {
    const { final_product, composition_items } = createCompositionsDto;
    const currentUser = this.sessionService.getCurrentUser();

    const finalProduct =
      await this.compositionsRepository.findFinalProductById(final_product);
    if (!finalProduct || finalProduct.origin !== Origin.MADE) {
      throw new BadRequestException(
        `Product ${final_product} is not a final product`
      );
    }

    const existingCompositions =
      await this.compositionsRepository.findByProductMade(final_product);
    if (existingCompositions) {
      throw new BadRequestException(
        `Composition to product ${final_product} already exists`
      );
    }

    const errorMessages = [];
    const uniqueRawProductIds = new Set<number>();
    for (const item of composition_items) {
      if (uniqueRawProductIds.has(item.raw_product)) {
        errorMessages.push(`Duplicate raw product ID: ${item.raw_product}`);
        continue;
      }
      uniqueRawProductIds.add(item.raw_product);

      const rawProduct = await this.compositionsRepository.findFinalProductById(
        item.raw_product
      );
      if (!rawProduct) {
        errorMessages.push(`Product ${item.raw_product} not found`);
        continue;
      }
      if (rawProduct.origin !== Origin.RAW_MATERIAL) {
        errorMessages.push(`Product ${item.raw_product} is not a raw product`);
      }
    }

    if (errorMessages.length > 0) {
      throw new BadRequestException({
        success: false,
        errors: errorMessages,
        message: errorMessages.join(', ')
      });
    }

    const description = `Composição ${finalProduct.description}`;

    try {
      const compositionsDocument =
        await this.compositionsRepository.createCompositions({
          product_made: {
            connect: { id: Number(createCompositionsDto.final_product) }
          },
          description: description,
          production_steps: createCompositionsDto.production_steps,
          created_by: currentUser,
          updated_by: currentUser
        });

      if (!compositionsDocument) {
        throw new Error('Failed to create compositions document');
      }

      let sequencia = 1;

      for (const item of createCompositionsDto.composition_items) {
        await this.compositionsRepository.createCompositionsItems({
          compositions: { connect: { id: compositionsDocument.id } },
          sequence: sequencia,
          product_raw: { connect: { id: item.raw_product } },
          quantity: item.quantity,
          created_at: new Date(),
          updated_at: new Date(),
          created_by: currentUser,
          updated_by: currentUser
        });
        sequencia++;
      }

      const allItems = await this.compositionsRepository.getCompositionsItems(
        compositionsDocument.id
      );

      const createdItems = allItems.map(item => ({
        id: item.id,
        compositions_id: item.composition_id,
        sequence: item.sequence,
        raw_product: item.raw_product,
        description: item.product_raw?.description,
        quantity: item.quantity,
        created_at: formatDate(item.created_at)
      }));

      return {
        id: compositionsDocument.id,
        final_product: compositionsDocument.final_product,
        description: compositionsDocument.description,
        created_at: formatDate(compositionsDocument.created_at),
        production_steps: compositionsDocument.production_steps,
        composition_items: createdItems
      } as ResponseCompositionsDto;
    } catch (error) {
      throw new Error(
        `Error during item insertion: ${(error as Error).message}`
      );
    }
  }

  async findAll(orderBy: string): Promise<ResponseCompositionsDto[]> {
    const compositions =
      await this.compositionsRepository.findAllCompositionsItems(orderBy);

    return compositions.map(composition => ({
      id: composition.id,
      final_product: composition.final_product,
      description: composition.description,
      production_steps:
        typeof composition.production_steps === 'string'
          ? JSON.parse(composition.production_steps)
          : composition.production_steps,
      created_at: formatDate(composition.created_at),
      updated_at: formatDate(composition.updated_at),
      composition_items: (composition['composition_items'] || []).map(item => ({
        id: item.id,
        compositions_id: item.compositions_id,
        sequence: item.sequence,
        raw_product: item.raw_product,
        description: item.product_raw?.description,
        quantity: item.quantity,
        created_at: formatDate(composition.created_at),
        updated_at: formatDate(composition.updated_at)
      }))
    }));
  }

  async findOne(id: number): Promise<ResponseCompositionsDto> {
    const composition = await this.compositionsRepository.findById(id);

    if (!composition) {
      throw new NotFoundException(`Composition with ID ${id} not found`);
    }

    return {
      id: composition.id,
      final_product: composition.final_product,
      description: composition.description,
      production_steps:
        typeof composition.production_steps === 'string'
          ? JSON.parse(composition.production_steps)
          : composition.production_steps,
      created_at: formatDate(composition.created_at),
      updated_at: formatDate(composition.updated_at),
      composition_items: (composition['composition_items'] || []).map(item => ({
        id: item.id,
        compositions_id: item.compositions_id,
        sequence: item.sequence,
        raw_product: item.raw_product,
        description: item.product_raw?.description,
        quantity: item.quantity,
        created_at: formatDate(item.created_at),
        updated_at: formatDate(item.updated_at)
      }))
    };
  }

  async getByProduct(product_id: number) {
    const composition =
      await this.compositionsRepository.findByProductMade(product_id);
    if (!composition) {
      throw new Error('Composição não encontrada');
    }

    return { production_steps: composition.production_steps };
  }

  async update(id: number, updateCompositionsDto: UpdateCompositionsDto) {
    const currentUser = this.sessionService.getCurrentUser();

    const existingComposition = await this.compositionsRepository.findById(id);
    if (!existingComposition) {
      throw new Error(`Composition with ID ${id} not found`);
    }

    const existingItems =
      await this.compositionsRepository.getCompositionsItems(id);

    if (!existingItems || existingItems.length === 0) {
      throw new Error(`Composition items not found for composition ID ${id}`);
    }

    for (const item of updateCompositionsDto.composition_items) {
      const itemExists = existingItems.find(
        existingItem => existingItem.id === item.id
      );

      if (!itemExists) {
        throw new Error(
          `Composition item with ID ${item.id} not found for composition ID ${id}`
        );
      }
    }

    const updatedComposition =
      await this.compositionsRepository.updateCompositions(id, {
        description: updateCompositionsDto.description,
        production_steps: updateCompositionsDto.production_steps,
        updated_at: new Date(),
        updated_by: currentUser
      });

    for (const item of updateCompositionsDto.composition_items) {
      const existingItem = existingItems.find(i => i.id === item.id);

      if (existingItem) {
        const fieldsToUpdate: Partial<typeof item> = {};

        if (existingItem.quantity === null)
          fieldsToUpdate['quantity'] = item.quantity;
        if (existingItem.updated_at !== undefined)
          fieldsToUpdate['updated_at'] = new Date();
        if (existingItem.updated_by !== undefined)
          fieldsToUpdate['updated_by'] = currentUser;

        if (Object.keys(fieldsToUpdate).length > 0) {
          await this.compositionsRepository.updateCompositionsItems(item.id, {
            ...fieldsToUpdate,
            quantity: item.quantity,
            updated_at: new Date(),
            updated_by: currentUser
          });
        }
      }
    }
    const updatedItems = [];
    const allItems = await this.compositionsRepository.getCompositionsItems(id);

    updatedItems.push(
      ...allItems.map(item => ({
        id: item.id,
        compositions_id: item.composition_id,
        sequence: item.sequence,
        raw_product: item.raw_product,
        description: item.product_raw?.description,
        quantity: item.quantity,
        created_at: formatDate(item.created_at),
        updated_at: formatDate(item.updated_at)
      }))
    );

    return {
      compositionsDocument: {
        id: updatedComposition.id,
        product_id: updatedComposition.final_product,
        description: updatedComposition.description,
        updated_at: formatDate(updatedComposition.updated_at),
        production_steps: updatedComposition.production_steps,
        items: updatedItems
      }
    };
  }

  async delete(id: number) {
    const composition = await this.compositionsRepository.findById(id);
    if (!composition) {
      throw new NotFoundException(`Composição com ID ${id} não encontrada`);
    }
    return this.compositionsRepository.delete(id);
  }
}
