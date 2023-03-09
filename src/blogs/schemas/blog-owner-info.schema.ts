import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  generateLengthErrorMessage,
  generateRegExpError,
} from '../../common/error-messages';
import { usersConstants } from '../../common/constants';

const { MIN_LOGIN_LENGTH, MAX_LOGIN_LENGTH, LOGIN_REG_EXP } = usersConstants;

@Schema()
export class BlogOwnerInfo {
  @Prop({
    type: String,
    required: true,
  })
  ownerId: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
    minlength: [
      MIN_LOGIN_LENGTH,
      generateLengthErrorMessage('login', MIN_LOGIN_LENGTH, 'min'),
    ],
    maxlength: [
      MAX_LOGIN_LENGTH,
      generateLengthErrorMessage('login', MAX_LOGIN_LENGTH, 'max'),
    ],
    validate: [LOGIN_REG_EXP, generateRegExpError('login', LOGIN_REG_EXP)],
  })
  ownerLogin: string;
}

export const BlogOwnerInfoSchema = SchemaFactory.createForClass(BlogOwnerInfo);
