import { Request } from 'express';
import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
}
