import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateOrFilterModel } from '../../../common/types';
import { ClientsRequestsRepository } from '../../infrastructure/clients-requests.repository';

export class UpdateManyClientsRequestsCommand {
  constructor(
    public filter: UpdateOrFilterModel,
    public fields: UpdateOrFilterModel,
  ) {}
}

@CommandHandler(UpdateManyClientsRequestsCommand)
export class UpdateManyClientsRequestsUseCase
  implements ICommandHandler<UpdateManyClientsRequestsCommand>
{
  constructor(private clientsRequestsRepository: ClientsRequestsRepository) {}

  execute(command: UpdateManyClientsRequestsCommand): Promise<void> {
    const { fields, filter } = command;

    return this.clientsRequestsRepository.updateManyClientsRequestsByFilter(
      filter,
      fields,
    );
  }
}
