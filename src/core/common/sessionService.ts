import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionService {
  getCurrentUser(): string {
    // TODO: Implementar a lógica de recuperação do usuário logado
    return 'root';
  }
}
