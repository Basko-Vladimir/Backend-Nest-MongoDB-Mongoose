import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ClientRequestDocument } from '../../schemas/client-request.schema';
import { ClientsRequestsRepository } from '../../infrastructure/clients-requests.repository';

export class UpdateClientRequestCommand {
  constructor(public clientRequest: ClientRequestDocument) {}
}

@CommandHandler(UpdateClientRequestCommand)
export class UpdateClientRequestUseCase
  implements ICommandHandler<UpdateClientRequestCommand>
{
  constructor(private clientsRequestsRepository: ClientsRequestsRepository) {}

  async execute(command: UpdateClientRequestCommand): Promise<void> {
    const { clientRequest } = command;
    const updatedClientRequest =
      clientRequest.updateClientRequest(clientRequest);
    await this.clientsRequestsRepository.saveClientRequest(
      updatedClientRequest,
    );
  }
}
