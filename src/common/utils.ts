import { Types } from 'mongoose';

export const getFilterByDbId = (id: string): { _id: Types.ObjectId } => ({
  _id: new Types.ObjectId(id),
});
