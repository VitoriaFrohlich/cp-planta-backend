import {
  Injectable
  // BadRequestException,
  // NotFoundException
} from '@nestjs/common';
// import { CreateCompositionOrderDto } from './dto/create.composition.orders.dto';
// import { ResponseCompositionOrderDto } from './dto/response.composition.orders.dto';
// import { UpdateCompositionOrderDto } from './dto/update.composition.orders.dto';
// import { Origin } from '../common/enums';
// import { formatDate } from '../common/utils';
import { CompositionOrdersRepository } from './composition.orders.repository';
import { SessionService } from '../common/sessionService';

@Injectable()
export class CompositionOrdersService {
  constructor(
    private readonly sessionService: SessionService,
    private readonly compositionsRepository: CompositionOrdersRepository
  ) {}
}
