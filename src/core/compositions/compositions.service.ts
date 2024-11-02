import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { CreateCompositionsDto } from './dto/create.compositions.dto';
import { ResponseCompositionsDto } from './dto/response.compositions.dto';
import { UpdateCompositionsDto } from './dto/update.compositions.dto';
import { CompositionsRepository } from './compositions.repository';
import { format, isValid } from 'date-fns';
import { Origin } from '../common/enums';

@Injectable()
export class CompositionsService {
  constructor(
    private readonly compositionsRepository: CompositionsRepository
  ) {}

  private getCurrentUser(): string {
    //TODO: Implementar busca do usuário logado
    return 'root';
  }

  async create(createCompositionsDto: CreateCompositionsDto) {
    const errorMessages = [];

    if (!Array.isArray(createCompositionsDto.composition_items)) {
      throw new BadRequestException('Items must be an array');
    }

    const finalProduct = await this.compositionsRepository.findFinalProductById(
      createCompositionsDto.final_product
    );

    if (finalProduct.origin !== Origin.MADE) {
      throw new BadRequestException(
        `Product ${createCompositionsDto.final_product} is not a final product`
      );
    }

    const existingCompositions =
      await this.compositionsRepository.findByProductMade(
        createCompositionsDto.final_product
      );
    if (existingCompositions) {
      throw new BadRequestException(
        `Composition to product ${createCompositionsDto.final_product} already exists`
      );
    }

    for (const item of createCompositionsDto.composition_items) {
      const rawProduct = await this.compositionsRepository.findFinalProductById(
        item.raw_product
      );

      if (!rawProduct) {
        errorMessages.push(`Product ${item.raw_product} not found`);
        break;
      }

      if (rawProduct.origin == Origin.MADE) {
        errorMessages.push(`Product ${item.raw_product} is not a raw product`);
        break;
      }
    }

    if (errorMessages.length > 0) {
      return {
        success: false,
        errors: errorMessages,
        message: 'Não foi possível processar todos os itens do documento.'
      };
    }

    const descriptionProduct = finalProduct?.description;

    if (!descriptionProduct) {
      throw new Error('Produto não encontrado');
    }

    const currentUser = this.getCurrentUser();
    const description = `Composição ${descriptionProduct}`;

    let compositionsDocument;
    const createdItems = [];
    try {
      compositionsDocument =
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

      // Inserção dos itens
      for (const item of createCompositionsDto.composition_items) {
        const createdItem =
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
        createdItems.push(createdItem);
      }

      return {
        compositionsDocument: {
          id: compositionsDocument.id,
          product_id: compositionsDocument.product_id,
          description: compositionsDocument.description,
          created_at: compositionsDocument.created_at,
          production_steps: compositionsDocument.production_steps,
          items: createdItems
        }
      };
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
      production_steps: Array.isArray(composition.production_steps)
        ? composition.production_steps.map(step => String(step))
        : [],
      created_at: this.formatDate(composition.created_at),
      updated_at: this.formatDate(composition.updated_at),
      created_by: composition.created_by,
      updated_by: composition.updated_by,
      composition_items: (composition['composition_items'] || []).map(item => ({
        id: item.id,
        compositions_id: item.compositions_id,
        sequence: item.sequence,
        raw_product: item.raw_product,
        quantity: item.quantity,
        created_at: this.formatDate(item.created_at),
        updated_at: this.formatDate(item.updated_at),
        created_by: item.created_by,
        updated_by: item.updated_by
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
      production_steps: Array.isArray(composition.production_steps)
        ? composition.production_steps.map(step => String(step))
        : [],
      created_at: this.formatDate(composition.created_at),
      updated_at: this.formatDate(composition.updated_at),
      created_by: composition.created_by,
      updated_by: composition.updated_by,
      composition_items: (composition['composition_items'] || []).map(item => ({
        id: item.id,
        compositions_id: item.compositions_id,
        sequence: item.sequence,
        raw_product: item.raw_product,
        quantity: item.quantity,
        created_at: this.formatDate(item.created_at),
        updated_at: this.formatDate(item.updated_at),
        created_by: item.created_by,
        updated_by: item.updated_by
      }))
    };
  }

  async update(id: number, updateCompositionsDto: UpdateCompositionsDto) {
    const currentUser = this.getCurrentUser();

    const existingComposition = await this.compositionsRepository.findById(id);
    if (!existingComposition) {
      throw new Error(`Composition with ID ${id} not found`);
    }

    const updatedComposition =
      await this.compositionsRepository.updateCompositions(id, {
        description: updateCompositionsDto.description,
        production_steps: updateCompositionsDto.production_steps,
        updated_at: new Date(),
        updated_by: currentUser
      });

    const existingItems =
      await this.compositionsRepository.getCompositionsItems(id);

    const updatedItems = [];

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
          updatedItems.push({ ...existingItem, ...fieldsToUpdate });
        }
      }
    }

    return {
      compositionsDocument: {
        id: updatedComposition.id,
        product_id: updatedComposition.final_product,
        description: updatedComposition.description,
        updated_at: format(updatedComposition.updated_at, 'dd/MM/yyyy'),
        production_steps: updatedComposition.production_steps,
        items: updatedItems
      }
    };
  }

  async delete(id: number) {
    return this.compositionsRepository.delete(id);
  }

  private formatDate(date: Date | null | undefined): string | null {
    if (date && isValid(date)) {
      return format(date, 'dd/MM/yyyy');
    }
    return null;
  }
}
