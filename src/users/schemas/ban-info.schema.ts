import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { generateLengthErrorMessage } from '../../common/error-messages';
import { usersConstants } from '../../common/constants';

const { MIN_BAN_REASON_LENGTH } = usersConstants;
@Schema()
export class BanInfo {
  @Prop({
    type: Boolean,
    required: true,
    default: false,
  })
  isBanned: boolean;

  @Prop({
    type: Date,
    default: null,
  })
  banDate: Date;

  @Prop({
    type: String,
    minlength: [
      MIN_BAN_REASON_LENGTH,
      generateLengthErrorMessage('banReason', MIN_BAN_REASON_LENGTH, 'min'),
    ],
  })
  banReason: string;
}

export const BanInfoSchema = SchemaFactory.createForClass(BanInfo);
