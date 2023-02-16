import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../../blogs/blogs.repository';

@ValidatorConstraint({ name: 'IsNotEmptyString', async: true })
@Injectable()
export class IsExistEntityValidator implements ValidatorConstraintInterface {
  constructor(protected blogsRepository: BlogsRepository) {}

  async validate(id: string): Promise<boolean> {
    const entity = await this.blogsRepository.findBlogById(id);

    return Boolean(entity);
  }

  defaultMessage(args: ValidationArguments) {
    return `Entity with such "${args.property}" doesn't exist!`;
  }
}

export function IsExistEntity(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsExistEntityValidator,
    });
  };
}
