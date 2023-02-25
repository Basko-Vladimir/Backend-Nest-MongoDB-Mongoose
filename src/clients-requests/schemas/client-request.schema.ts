import { HydratedDocument, Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class ClientRequest {
  @Prop({
    type: String,
    required: true,
  })
  endpoint: string;

  @Prop({
    type: String,
    required: true,
  })
  ip: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export type ClientRequestDocument = HydratedDocument<ClientRequest>;

export type ClientRequestModelType = Model<ClientRequest>;

export const clientRequestSchema = SchemaFactory.createForClass(ClientRequest);
