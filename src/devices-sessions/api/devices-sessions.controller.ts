import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { User } from '../../common/decorators/user.decorator';
import { UserDocument } from '../../users/schemas/user.schema';
import { DeviceSessionOutputModel } from './dto/devices-sessions-output-models.dto';
import { RefreshTokenGuard } from '../../common/guards/refresh-token.guard';
import { Session } from '../../common/decorators/session.decorator';
import { DeviceSessionDocument } from '../schemas/device-session.schema';
import { QueryDevicesSessionsRepository } from '../infrastructure/query-devices-sessions.repository';
import { DevicesSessionsService } from '../application/devices-sessions.service';

@Controller('security')
export class DevicesSessionsController {
  constructor(
    private devicesSessionsService: DevicesSessionsService,
    private queryDevicesSessionsRepository: QueryDevicesSessionsRepository,
  ) {}

  @Get('devices')
  @UseGuards(RefreshTokenGuard)
  async getAllActiveDevicesSessions(
    @User() user: UserDocument,
  ): Promise<DeviceSessionOutputModel[]> {
    return this.queryDevicesSessionsRepository.getAllActiveDevicesSessions({
      userId: user._id,
    });
  }

  @Delete('devices')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RefreshTokenGuard)
  async deleteAllDevicesSessionsExceptCurrent(
    @Session() session: DeviceSessionDocument,
  ): Promise<void> {
    await this.devicesSessionsService.deleteAllDevicesSessionsExceptCurrent(
      session._id,
    );
  }

  @Delete('devices/:deviceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RefreshTokenGuard)
  async deleteDeviceSessionByDeviceId(
    @Param('deviceId') deviceId: string,
    @User() user: UserDocument,
  ): Promise<void> {
    const targetDeviceSession =
      await this.devicesSessionsService.findDeviceSessionByFilter({ deviceId });

    if (!targetDeviceSession) throw new NotFoundException();

    if (String(targetDeviceSession.userId) !== String(user._id)) {
      throw new ForbiddenException();
    }

    await this.devicesSessionsService.deleteDeviceSessionById(
      String(targetDeviceSession._id),
    );
  }
}
