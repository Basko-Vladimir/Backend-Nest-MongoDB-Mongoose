import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class BlogBanInfo {
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
}

export const BlogBanInfoSchema = SchemaFactory.createForClass(BlogBanInfo);
