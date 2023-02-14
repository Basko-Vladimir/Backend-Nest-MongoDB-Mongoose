import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsNotEmptyString', async: false })
export class IsNotEmptyString implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return typeof text === 'string' && text.trim() !== '';
  }

  defaultMessage(args: ValidationArguments) {
    return `Field "${args.property}" can not be empty string!`;
  }
}
