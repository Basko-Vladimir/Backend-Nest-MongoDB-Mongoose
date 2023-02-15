import { Types } from 'mongoose';
import { PipeTransform } from '@nestjs/common';
import { generateCustomBadRequestException } from '../utils';

export class ParseObjectIdPipe implements PipeTransform {
  transform(value: string): string {
    const validObjectId = Types.ObjectId.isValid(value);

    if (!validObjectId) {
      generateCustomBadRequestException('Invalid paramId', 'paramId');
    }

    return value;
  }
}
