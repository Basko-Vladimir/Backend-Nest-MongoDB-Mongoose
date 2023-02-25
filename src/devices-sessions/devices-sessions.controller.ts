import { Request } from 'express';
import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DevicesSessionsService } from './devices-sessions.service';
import { User } from '../common/decorators/user.decorator';
import { UserDocument } from '../users/schemas/user.schema';
import { DeviceSessionOutputModel } from './dto/devices-sessions-output-models.dto';
import { RefreshTokenGuard } from '../common/guards/refresh-token.guard';

@Controller('security')
export class DevicesSessionsController {
  constructor(protected devicesSessionsService: DevicesSessionsService) {}

  @Get('devices')
  @UseGuards(RefreshTokenGuard)
  async getAllActiveDevicesSessions(
    @User() user: UserDocument,
  ): Promise<DeviceSessionOutputModel[]> {
    return this.devicesSessionsService.getAllActiveDevicesSessions({
      userId: user._id,
    });
  }

  @Delete('devices')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RefreshTokenGuard)
  async deleteAllDevicesSessionsExceptCurrent(
    @Req() request: Request,
  ): Promise<void> {
    await this.devicesSessionsService.deleteAllDevicesSessionsExceptCurrent(
      request.context.session._id,
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
