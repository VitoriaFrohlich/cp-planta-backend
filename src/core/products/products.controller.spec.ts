/*import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Origin, Unit_Measure } from '../common/enums';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            create: jest.fn(),
          }
        }
      ]
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a product and return it with all expected fields', async () => {
      const createProductDto: CreateProductDto = {
        description: 'new product',
        code: 'P12345',
        sku: 'SKU12345',
        origin: Origin.RAW_MATERIAL,
        unit_measure: Unit_Measure.KG,
        category_id: 1,
        group_id: 1,
        supplier_id: 2,
        nutritional_info: 'nutricional info',
        active: true,
        price: 100.0,
        quantity: 10,
      };

      const expectedResult = {
        id: 1,
        ...createProductDto,
        created_at: new Date().toISOString(), 
        updated_at: new Date().toISOString(),
        created_by: 1,
        updated_by: 1,
      };

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult);

      const result = await controller.create(createProductDto);

      expect(result).toEqual(expectedResult); 
      expect(service.create).toHaveBeenCalledWith(createProductDto); 
    });
  });
});*/
