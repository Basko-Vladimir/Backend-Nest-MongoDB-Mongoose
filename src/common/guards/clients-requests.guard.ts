import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ClientRequestSortByField, DbSortDirection } from '../enums';
import { ClientsRequestsService } from '../../clients-requests/clients-requests.service';
import { TooManyRequestsException } from '../exceptions/too-many-requests.exception';

@Injectable()
export class ClientsRequestsGuard implements CanActivate {
  TIME_LIMIT = 10000;
  COUNT_LIMIT = 5;

  constructor(protected clientRequestsService: ClientsRequestsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const endpoint = req.originalUrl;
    const ip = req.ip;
    const sortFilter = {
      [ClientRequestSortByField.createTimeStamp as string]: DbSortDirection.ASC,
    };

    const currentMoment = Date.now();
    const clientRequests =
      await this.clientRequestsService.getClientRequestsByFilter(
        { endpoint, ip },
        sortFilter,
      );

    if (clientRequests.length >= this.COUNT_LIMIT) {
      const timeBetweenLastFirstRequests =
        currentMoment - clientRequests[0].createTimeStamp;

      if (timeBetweenLastFirstRequests <= this.TIME_LIMIT) {
        await this.clientRequestsService.updateManyClientsRequestsByFilter(
          { endpoint, ip },
          { createTimeStamp: currentMoment },
        );

        throw new TooManyRequestsException();
      } else {
        await this.clientRequestsService.updateClientRequest(clientRequests[0]);
      }
    } else {
      await this.clientRequestsService.createClientRequest(endpoint, ip);
    }

    return true;
  }
}
