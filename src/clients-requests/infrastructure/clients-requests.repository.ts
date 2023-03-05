import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientRequest } from 'http';
import {
  ClientRequestDocument,
  ClientRequestModelType,
} from '../schemas/client-request.schema';
import { UpdateOrFilterModel } from '../../common/types';
import { DbSortDirection } from '../../common/enums';

@Injectable()
export class ClientsRequestsRepository {
  constructor(
    @InjectModel(ClientRequest.name)
    protected ClientRequestModel: ClientRequestModelType,
  ) {}

  async getClientRequestsByFilter(
    filter: UpdateOrFilterModel,
    sortFilter: UpdateOrFilterModel<DbSortDirection> = {},
  ): Promise<ClientRequestDocument[]> {
    return this.ClientRequestModel.find(filter).sort(sortFilter);
  }

  async saveClientRequest(
    clientRequest: ClientRequestDocument,
  ): Promise<ClientRequestDocument> {
    return clientRequest.save();
  }

  async updateManyClientsRequestsByFilter(
    filter: UpdateOrFilterModel,
    fields: UpdateOrFilterModel,
  ): Promise<void> {
    const { matchedCount } = await this.ClientRequestModel.updateMany(
      filter,
      fields,
    );

    if (!matchedCount) throw new NotFoundException();
  }
}
