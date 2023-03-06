import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { ClientsRequestsRepository } from '../../infrastructure/clients-requests.repository';
import {
  ClientRequest,
  ClientRequestModelType,
} from '../../schemas/client-request.schema';

export class CreateClientRequestCommnad {
  constructor(public endpoint: string, public ip: string) {}
}

@CommandHandler(CreateClientRequestCommnad)
export class CreateClientRequestUseCase
  implements ICommandHandler<CreateClientRequestCommnad>
{
  constructor(
    private clientsRequestsRepository: ClientsRequestsRepository,
    @InjectModel(ClientRequest.name)
    private ClientRequestModel: ClientRequestModelType,
  ) {}

  async execute(command: CreateClientRequestCommnad): Promise<string> {
    const { ip, endpoint } = command;
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
}
