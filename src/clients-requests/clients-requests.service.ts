import { Injectable } from '@nestjs/common';
import { ClientsRequestsRepository } from './clients-requests.repository';

@Injectable()
export class ClientsRequestsService {
  constructor(protected clientsRequestsRepository: ClientsRequestsRepository) {}
}
