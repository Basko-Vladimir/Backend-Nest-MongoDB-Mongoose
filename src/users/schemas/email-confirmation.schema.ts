import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DATE_ERROR_MESSAGE } from '../../common/error-messages';

@Schema()
export class EmailConfirmation {
  @Prop({
    type: String,
    trim: true,
  })
  confirmationCode: string;

  @Prop({
    type: Boolean,
    required: true,
    default: false,
  })
  isConfirmed: boolean;

  @Prop({
    type: Date,
    required: true,
    min: [new Date(), DATE_ERROR_MESSAGE],
  })
  expirationDate: Date;
}

export const EmailConfirmationSchema =
  SchemaFactory.createForClass(EmailConfirmation);
