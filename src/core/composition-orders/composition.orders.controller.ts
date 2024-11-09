import {
  Controller
  // Get,
  // Post,
  // Body,
  // Patch,
  // Param,
  // Query,
  // BadRequestException,
  // Delete
} from '@nestjs/common';
import { CompositionOrdersService } from './composition.orders.service';
// import { ResponseCompositionOrderDto } from './dto/response.composition.orders.dto';
// import { UpdateCompositionOrderDto } from './dto/update.composition.orders.dto';
// import { ApiQuery } from '@nestjs/swagger';

@Controller('compositions')
export class CompositionOrdersController {
  constructor(private readonly compositionsService: CompositionOrdersService) {}
}
