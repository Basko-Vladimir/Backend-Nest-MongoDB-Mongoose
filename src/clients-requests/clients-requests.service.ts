import { Injectable } from '@nestjs/common';
import { ClientsRequestsRepository } from './clients-requests.repository';
import { UpdateOrFilterModel } from '../common/types';
import { DbSortDirection } from '../common/enums';
import {
  ClientRequest,
  ClientRequestDocument,
  ClientRequestModelType,
} from './schemas/client-request.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ClientsRequestsService {
  constructor(
    protected clientsRequestsRepository: ClientsRequestsRepository,
    @InjectModel(ClientRequest.name)
    protected ClientRequestModel: ClientRequestModelType,
  ) {}

  async getClientRequestsByFilter(
    filter: UpdateOrFilterModel,
    sortFilter: UpdateOrFilterModel<DbSortDirection>,
  ): Promise<ClientRequestDocument[]> {
    return this.clientsRequestsRepository.getClientRequestsByFilter(
      filter,
      sortFilter,
    );
  }

  async createClientRequest(endpoint: string, ip: string): Promise<string> {
    const createdClientRequest = this.ClientRequestModel.createClientEntity(
      { endpoint, ip },
      this.ClientRequestModel,
    );
    const savedClientRequest =
      await this.clientsRequestsRepository.saveClientRequest(
        createdClientRequest,
      );

    return String(savedClientRequest._id);
  }

  async updateClientRequest(
    clientRequest: ClientRequestDocument,
  ): Promise<void> {
    const updatedClientRequest =
      clientRequest.updateClientRequest(clientRequest);
    await this.clientsRequestsRepository.saveClientRequest(
      updatedClientRequest,
    );
  }

  async updateManyClientsRequestsByFilter(
    filter: UpdateOrFilterModel,
    fields: UpdateOrFilterModel,
  ): Promise<void> {
    return this.clientsRequestsRepository.updateManyClientsRequestsByFilter(
      filter,
      fields,
    );
  }
}
