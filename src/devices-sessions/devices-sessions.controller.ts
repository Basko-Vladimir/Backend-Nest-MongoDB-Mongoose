import { Controller, Get, UseGuards } from '@nestjs/common';
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
}
