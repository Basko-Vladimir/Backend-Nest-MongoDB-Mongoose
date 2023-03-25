import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  generateLengthErrorMessage,
  generateRegExpError,
} from '../../common/error-messages';
import { usersConstants } from '../../common/constants';

const { MIN_BAN_REASON_LENGTH } = usersConstants;
const { MIN_LOGIN_LENGTH, MAX_LOGIN_LENGTH, LOGIN_REG_EXP } = usersConstants;

@Schema()
export class BannedUser {
  @Prop({
    type: String,
    required: true,
  })
  userId: string;

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
  userLogin: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  isBanned: boolean;

  @Prop({
    type: Date,
    required: true,
  })
  banDate: Date;

  @Prop({
    type: String,
    required: true,
    minlength: [
      MIN_BAN_REASON_LENGTH,
      generateLengthErrorMessage('banReason', MIN_BAN_REASON_LENGTH, 'min'),
    ],
  })
  banReason: string;
}

export const BannedUserSchema = SchemaFactory.createForClass(BannedUser);
