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

  @Prop({
    type: Number,
    required: true,
  })
  createTimeStamp: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  static createClientEntity(
    clientRequestData: Partial<ClientRequest>,
    ClientRequestModel: ClientRequestModelType,
  ): ClientRequestDocument {
    return new ClientRequestModel({
      ...clientRequestData,
      createTimeStamp: Date.now(),
    });
  }

  updateClientRequest(): void {
    this.createTimeStamp = Date.now();
  }
}

export type ClientRequestDocument = HydratedDocument<ClientRequest>;

interface IClientRequestStaticMethods {
  createClientEntity(
    clientRequestData: Partial<ClientRequest>,
    ClientRequestModel: ClientRequestModelType,
  ): ClientRequestDocument;
}

export type ClientRequestModelType = Model<ClientRequest> &
  IClientRequestStaticMethods;

export const clientRequestSchema = SchemaFactory.createForClass(ClientRequest);

clientRequestSchema.static(
  'createClientEntity',
  ClientRequest.createClientEntity,
);
clientRequestSchema.method(
  'updateClientRequest',
  ClientRequest.prototype.updateClientRequest,
);
