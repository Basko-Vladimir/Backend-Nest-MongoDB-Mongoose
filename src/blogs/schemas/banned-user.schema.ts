import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { generateLengthErrorMessage } from '../../common/error-messages';
import { usersConstants } from '../../common/constants';

const { MIN_BAN_REASON_LENGTH } = usersConstants;

@Schema()
export class BannedUser {
  @Prop({
    type: String,
    required: true,
  })
  userId: string;

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
