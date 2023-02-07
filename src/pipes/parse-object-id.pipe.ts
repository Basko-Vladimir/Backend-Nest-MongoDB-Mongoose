import { Types } from 'mongoose';
import { PipeTransform, BadRequestException } from '@nestjs/common';

export class ParseObjectIdPipe implements PipeTransform {
  transform(value: string): Types.ObjectId {
    const validObjectId = Types.ObjectId.isValid(value);

    if (!validObjectId) throw new BadRequestException('Invalid ObjectId');

    return new Types.ObjectId(value);
  }
}
