import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
  })
  expirationDate: Date;
}

export const EmailConfirmationSchema =
  SchemaFactory.createForClass(EmailConfirmation);
