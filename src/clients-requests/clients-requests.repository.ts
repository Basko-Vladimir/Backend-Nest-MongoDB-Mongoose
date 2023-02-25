import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientRequest } from 'http';
import { ClientRequestModelType } from './schemas/client-request.schema';

@Injectable()
export class ClientsRequestsRepository {
  constructor(
    @InjectModel(ClientRequest.name)
    protected ClientRequestModel: ClientRequestModelType,
  ) {}
}
